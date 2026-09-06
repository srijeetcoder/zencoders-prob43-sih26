import { useState } from "react"
import Input from "./Input"
import { Link } from "react-router-dom";

function ForgetPassword() {
  const [formData, setFormData] = useState({
        email : "",
        otp : "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value 
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        console.log(formData);
    }
    
    return (
        <form onSubmit={handleSubmit} className="
          flex gap-5
          rounded-xl
          border border-gray-200
          bg-white
          px-5 py-5
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        ">
          <Input
            type="email"
            name="email"
            placeHolder="Please enter the email"
            value={formData.email}
            onChange={handleChange}
          />

           <button type="submit" className="
            bg-green-500
            shadow-sm
            transition-all duration-200 ease-in-out
            my-3 px-5 py-2
            text-white font-bold font-[14px]
            hover:bg-white hover:text-green-500 
            active:scale-95
            ring-2 ring-green-400
            rounded-[8px]
           "> Submit </button>
        </form>
    );
}

export default ForgetPassword
