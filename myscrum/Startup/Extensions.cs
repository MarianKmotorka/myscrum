using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using myscrum.Common.Constants;
using myscrum.Common.Options;
using myscrum.Services;
using myscrum.Services.Interfaces;

namespace myscrum.Startup
{
    public static class Extensions
    {
        public static IServiceCollection AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(x =>
            {
                x.SwaggerDoc("v1", new OpenApiInfo { Title = "myscrum-api", Version = "v1" });

                x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Jwt Bearer Token",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });

                x.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    { new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            }
                        }, new List<string>()
                    }
                });
            });

            services.ConfigureSwaggerGen(x => x.CustomSchemaIds(xx => xx.FullName));
            return services;
        }

        public static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration configuration)
        {
            var oAuthOptions = new GoogleOAuthOptions();
            configuration.GetSection(nameof(GoogleOAuthOptions)).Bind(oAuthOptions);
            services.AddSingleton(oAuthOptions);

            var jwtOptions = new JwtOptions();
            configuration.GetSection(nameof(JwtOptions)).Bind(jwtOptions);
            services.AddSingleton(jwtOptions);

            var tokenValidationParams = new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            services.AddSingleton(tokenValidationParams);

            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(o =>
            {
                o.TokenValidationParameters = tokenValidationParams;

                o.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var isAccessTokenClaim = context.Principal.Claims.SingleOrDefault(x => x.Type == CustomClaims.IsAccessToken);
                        if (isAccessTokenClaim is null)
                            context.Fail(new Exception("Token is missing 'IsAccessToken' claim."));

                        return Task.CompletedTask;
                    },
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(accessToken))
                            context.Token = accessToken;

                        return Task.CompletedTask;
                    }
                };

                o.SaveToken = true;
            });

            services.AddTransient<IAuthService, AuthService>();
            return services;
        }
    }
}
