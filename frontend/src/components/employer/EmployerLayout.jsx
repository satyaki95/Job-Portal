import EmployerNavbar from "./EmployerNavbar";

export default function EmployerLayout({ children }) {
  return (
    <div className="employer-theme">
      <EmployerNavbar />
      {children}
    </div>
  );
}
