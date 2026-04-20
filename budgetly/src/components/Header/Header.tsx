import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/create", label: "New Payment" },
];

const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <NavLink to="/" className="btn btn-ghost text-xl">
          Budgetly
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end hidden lg:flex">
        <NavLink to="/create" className="btn btn-primary">
          New Payment
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
