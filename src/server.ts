import express, { Application, Request, Response } from 'express';
import product_routes from './routes/Product_Routes'
import { File } from 'buffer';

const app: Application = express();
app.use(express.json())
const PORT = 5555;

app.use('/',product_routes)

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})