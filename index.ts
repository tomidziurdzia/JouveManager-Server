import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db";
// import userRoutes from "./src/routes/user.routes";
import vehicleRoutes from "./src/routes/vehicle.routes";
// import travelRoutes from "./src/routes/travel.routes";
// import shipmentRoutes from "./src/routes/shipment.routes";
import businessRoutes from "./src/routes/business.routes";
import employeeRoutes from "./src/routes/employee.routes";

const app = express();
app.use(express.json());
dotenv.config();

// Call DB
connectDB();

// Configurate CORS
// const whitelist = [process.env.FRONTEND_URL];

// const corsOptions = {
//   origin: function (origin: any, callback: any) {
//     if (whitelist.indexOf(origin) !== -1) {
//       // El origen del request esta permitido
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

//Routing
// app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
// app.use("/api/travels", travelRoutes);
// app.use("/api/shipments", shipmentRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/employees", employeeRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
