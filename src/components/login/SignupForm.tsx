import { useState } from "react"
import Input from "./Input"
import { Link } from "react-router-dom";

function SignupForm() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
        firstName : "",
        mobileNumber : "",
        email : "",
        password : "",
        confirmPassword : "",
        otp : "",
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value 
        });
        setError("");
    }

    function handleNext(e) {
        e.preventDefault();

        if (!formData.firstName || !formData.mobileNumber || !formData.email) {
            setError("Please fill in all fields");
            return;
        }

        setStep(2);
    }

    function handleBack() {
        setError("");
        setStep((prev) => prev - 1);
    }

    async function handlePasswordNext(e) {
        e.preventDefault();

        if (isSubmitting) return;

        if (!formData.password || !formData.confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            // OTP samla chagol
            setStep(3);
        } catch (err) {
            setError("Could not send OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;

        if (!formData.otp) {
            setError("Please enter the OTP");
            return;
        }

        setIsSubmitting(true);

        try {
            // Eta submit er jonno gadha
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
          onSubmit={
            step === 1 ? handleNext : step === 2 ? handlePasswordNext : handleSubmit
          }
          className="
          flex w-full max-w-md flex-col gap-5
          rounded-xl
          border border-gray-200
          bg-white
          px-8 py-10
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        ">
          <h1 className="text-3xl font-bold">Sign <span className="text-green-500">Up</span></h1>

          {step === 1 && (
            <>
              <Input
                type="text"
                name="firstName"
                placeHolder="Please enter your name"
                value={formData.firstName}
                onChange={handleChange}
              />

              <Input
                type="tel"
                name="mobileNumber"
                placeHolder="Please enter the Mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
              />

              <Input
                type="email"
                name="email"
                placeHolder="Please enter the email"
                value={formData.email}
                onChange={handleChange}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                type="password"
                name="password"
                placeHolder="Please enter a password"
                value={formData.password}
                onChange={handleChange}
              />

              <Input
                type="password"
                name="confirmPassword"
                placeHolder="Please confirm the password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-gray-500">
                We sent a code to {formData.mobileNumber || formData.email}
              </p>
              <Input
                type="text"
                name="otp"
                placeHolder="Please enter the OTP"
                value={formData.otp}
                onChange={handleChange}
              />
            </>
          )}

          {error && (
            <span className="text-xs font-bold text-red-500">{error}</span>
          )}

          <div className="flex gap-3 mx-6 my-3">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="
                flex-1 py-2 px-3
                text-green-500 font-bold font-[14px]
                border-2 border-green-400
                rounded-[8px]
                transition-all duration-200 ease-in-out
                hover:bg-green-50
                active:scale-95
              "> Back </button>
            )}

            <button type="submit" className="
              flex-1
              bg-green-500
              shadow-sm
              transition-all duration-200 ease-in-out
              py-2 px-3
              text-white font-bold font-[14px]
              hover:bg-white hover:text-green-500 
              active:scale-95
              ring-2 ring-green-400
              rounded-[8px]
            "> {step === 1 ? "Next" : step === 2 ? "Send OTP" : "Sign up"} </button>
          </div>

           <span className="whitespace-nowrap text-xs">
              Have an account? <Link to="/login" className="text-green-500 font-bold">Log In</Link> <br/> 
           </span>
        </form>
    );
}

export default SignupForm
