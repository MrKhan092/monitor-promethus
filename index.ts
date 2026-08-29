import express from "express";
import type { Request,Response ,NextFunction} from "express";
import promClinet from "prom-client";

const requestCounter = new promClinet.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

function middleware(req: Request, res: Response, next: NextFunction) {
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

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
}); 