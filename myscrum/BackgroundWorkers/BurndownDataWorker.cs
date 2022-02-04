using MediatR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Threading;
using System;
using Microsoft.Extensions.DependencyInjection;
using myscrum.Features.Sprints.Statistics;
using NCrontab;

namespace myscrum.BackgroundWorkers
{
    public class BurndownDataWorker : BackgroundService
    {
        private CrontabSchedule _schedule;
        private DateTime _nextRun;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<BurndownDataWorker> _logger;

        private string Schedule => "0 0 23 * * *"; //Runs every day at 23:00

        public BurndownDataWorker(IServiceProvider serviceProvider, ILogger<BurndownDataWorker> logger)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _schedule = CrontabSchedule.Parse(Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            _nextRun = _schedule.GetNextOccurrence(DateTime.UtcNow);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SaveBurndownData starting...");

            try
            {
                do
                {
                    if (DateTime.UtcNow > _nextRun)
                    {
                        try
                        {
                            using (var scope = _serviceProvider.CreateScope())
                            {
                                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
                                await mediator.Send(new SaveBurndownData.Command(), stoppingToken);
                                _logger.LogInformation("SaveBurndownData executed at {0}", DateTime.UtcNow);
                            }
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            // Pass
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error occured during SaveBurndownData execution.");
                        }

                        _nextRun = _schedule.GetNextOccurrence(DateTime.UtcNow);
                    }

                    await Task.Delay(TimeSpan.FromMinutes(20), stoppingToken);
                }
                while (!stoppingToken.IsCancellationRequested);
            }
            finally
            {
                _logger.LogDebug("Hard Delete Users Worker stopped.");
            }
        }
    }
}