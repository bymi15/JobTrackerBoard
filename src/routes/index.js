import async from "../components/Async";

// Landing
import Landing from "../containers/Landing";

// Auth
import Login from "../containers/auth/Login";
import Register from "../containers/auth/Register";
//import ResetPassword from "../containers/auth/ResetPassword";

// Dashboard
const DashboardMain = async(() => import("../containers/dashboard"));
const DashboardBoard = async(() => import("../containers/dashboard/board/Board"));
const DashboardMap = async(() => import("../containers/dashboard/map"));
const DashboardStats = async(() => import("../containers/dashboard/stats"));

// Routes

//Landing route
const landingRoute = {
    path: "/",
    component: Landing
}

//Main routes
const dashboardRoute = {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardMain
};

const dashboardBoardRoute = {
    path: "/dashboard/board",
    name: "Board",
    component: DashboardBoard
};

const dashboardMapRoute = {
    path: "/dashboard/map",
    name: "Map",
    component: DashboardMap
};

const dashboardStatsRoute = {
    path: "/dashboard/stats",
    name: "Statistics",
    component: DashboardStats
};

//Auth routes
const authRoute = {
    path: "/auth",
    name: "Auth",
    children: [
        {
            path: "/auth/login",
            name: "Login",
            component: Login
        },
        {
            path: "/auth/register",
            name: "Register",
            component: Register
        }
        // {
        //     path: "/auth/resetpassword",
        //     name: "Reset Password",
        //     component: ResetPassword
        // }
    ]
};

export const landingRoutes = [
    landingRoute
];

export const authRoutes = [
    authRoute
];

export const secureRoutes = [
    dashboardRoute,
    dashboardMapRoute,
    dashboardStatsRoute,
    dashboardBoardRoute
];