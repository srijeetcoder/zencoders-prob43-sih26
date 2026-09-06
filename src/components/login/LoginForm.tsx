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
          flex w-full max-w-md flex-col gap-5
          rounded-xl
          border border-gray-200
          bg-white
          px-8 py-10
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        ">
          <span className="whitespace-nowrap font-bold text-sm">
            Please enter your <span className="text-green-500">credentials</span>
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
           "> Submit </button>

           <span className="whitespace-nowrap text-xs">
              Don't have an account? <span className="text-green-500 font-bold">Sign up</span> <br/> 
              <span className="text-green-500 font-bold">Forget Password</span>
           </span>
        </form>
    );
}

export default LoginForm
