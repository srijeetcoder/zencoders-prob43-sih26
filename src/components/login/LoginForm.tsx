import { useState } from "react"
import Input from "./Input"

function LoginForm() {
    const [formData, setFormData] = useState({
        email : "",
        password : ""
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value 
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log(formData);
    }
    
    return (
        <form onSubmit={handleSubmit} className="
          relative overflow-hidden
          flex w-full max-w-md flex-col gap-5
          rounded-2xl
          border border-slate-200/80
          bg-white
          px-8 py-10
          shadow-[0_12px_40px_rgba(0,0,0,0.06)]
        ">
          {/* Subtle Watermark Background inside the Login Card */}
          <div 
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none z-0"
            aria-hidden="true"
          >
            <img
              src="/emblem.png"
              alt="Government Emblem Watermark"
              className="h-[85%] w-[85%] object-contain opacity-[0.07] filter grayscale transition-opacity duration-300"
            />
          </div>

          {/* Foreground Form Controls */}
          <div className="relative z-10 flex flex-col gap-5">
            <span className="whitespace-nowrap font-bold text-sm text-slate-800">
              Please enter your <span className="text-green-600">credentials</span>
            </span>

            <Input
              type="email"
              name="email"
              placeholder="Please enter the email..."
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              type="password"
              name="password"
              placeholder="Please enter the password..."
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className="
              bg-green-500
              shadow-sm
              transition-all duration-200 ease-in-out
              mx-6 my-3 py-2 px-3
              text-white font-bold font-[14px]
              hover:bg-white hover:text-green-500 
              active:scale-95
              ring-2 ring-green-400
              rounded-[8px]
              cursor-pointer
            "> Submit </button>

            <span className="whitespace-nowrap text-xs text-slate-600">
              Don't have an account? <span className="text-green-600 font-bold cursor-pointer hover:underline">Sign up</span> <br/> 
              <span className="text-green-600 font-bold cursor-pointer hover:underline">Forget Password</span>
            </span>
          </div>
        </form>
    );
}

export default LoginForm
