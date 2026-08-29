import express from "express";
import type { Request,Response ,NextFunction} from "express";
import promClinet from "prom-client";

const requestCounter = new promClinet.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});
const activeRequestsGauge = new promClinet.Gauge({
    name: 'active_requests',
    help: 'Number of active requests'
});
function middleware(req: Request, res: Response, next: NextFunction) {
    activeRequestsGauge.inc();
    const startTime = Date.now();

    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);

        // Increment request counter
        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
         activeRequestsGauge.dec();
    });
   

    next();
};

const app=express();
app.use(middleware);
app.get('/cpu',(req,res)=>{
    for( let i=0;i<10000;i++){
        Math.random();
    }
    res.json({
        message:"CPU intensive task completed"
    })
});
app.get('/users',(req,res)=>{
    res.json({
        message:"users"
    })
});
app.get('/metrics', async (req, res) => {
    const metrics = await promClinet.register.metrics();
    console.log(promClinet.register.contentType);
    res.set('Content-Type', promClinet.register.contentType);
    res.end(await promClinet.register.metrics());
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}); 