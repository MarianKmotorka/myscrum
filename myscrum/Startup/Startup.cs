using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using myscrum.Persistence;
using myscrum.Startup.ExceptionHandling;

namespace myscrum.Startup
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            FluentValidationCamelCasePropertyNameResolver.UseFluentValidationCamelCasePropertyResolver();

            services.AddSwagger();
            services.AddAuth(Configuration);
            services.AddHttpClient();
            services.AddHttpContextAccessor();
            services.AddControllersWithViews();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddDbContext<MyScrumContext>(options =>
                 options.UseSqlServer(
                     Configuration.GetConnectionString("MyScrumContext"),
                     builder => builder.MigrationsAssembly(typeof(MyScrumContext).Assembly.FullName)));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHttpsRedirection();
            app.UseCustomExceptionHandlingMiddleware();

            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "myscrum-api v1"));

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
