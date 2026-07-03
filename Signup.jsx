import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await signupUser({ name: form.name, email: form.email, password: form.password });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  const getStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (pwd.length < 10) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: "Strong", color: "bg-green-500", width: "w-full" };
    return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
  };

  const strength = getStrength(form.password);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏏</div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Cricket Scorer</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required className={inputClass + " pr-12"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{strength.label} password</p>
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                className={`${inputClass} ${
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? "border-red-400 focus:ring-red-400"
                    : form.confirmPassword && form.password === form.confirmPassword
                    ? "border-green-400 focus:ring-green-400"
                    : ""
                }`}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">Passwords don't match</p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ Passwords match</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 disabled:bg-slate-400 text-white font-semibold py-3 rounded-xl transition-colors mt-1">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 dark:text-white font-semibold hover:underline">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;