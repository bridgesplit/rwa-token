import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from "./navbar";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="w-screen min-h-screen">
            <ToastContainer />
            <Navbar />
            {children}
        </div>
    );
}