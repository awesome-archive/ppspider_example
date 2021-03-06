import {AddToQueue, FromQueue, Job, JobOverride, Launcher, logger, NoneWorkerFactory, OnStart} from "ppspider";

class TestTask {

    @OnStart({
        urls: "",
        workerFactory: NoneWorkerFactory
    })
    @AddToQueue({
        name: "test"
    })
    async onStart(useless: any, job: Job) {
        logger.debug("add jobs to test queue");
        return ["job_1", "job_2", "job_2#1", "job_3", "job_3#2"];
    }

    @JobOverride("test")
    overrideJobKey(job: Job) {
        // job_2#1 和 job_3#2 两个任务的key将改为 job_2，job_3，然后被 BloonFilter 过滤掉
        job.key = job.url.split("#")[0];
    }

    @FromQueue({
        name: "test",
        workerFactory: NoneWorkerFactory
    })
    async fromQueue(useless: any, job: Job) {
        logger.debug("fetch job from test queue and execute: " + job.url);
    }

}

@Launcher({
    workplace: __dirname + "/workplace",
    tasks: [
        TestTask
    ],
    workerFactorys: []
})
class App {}
