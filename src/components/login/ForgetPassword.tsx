import { useState } from "react";
import Input from "./Input";

function ForgetPassword() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex gap-5
        rounded-xl
        border border-gray-200
        bg-white
        px-5 py-5
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      "
    >
      {step === 1 && (
        <>
          <Input
            type="email"
            name="email"
            placeHolder="Please enter the email"
            value={formData.email}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setStep(2)}
            className="
              bg-green-500
              shadow-sm
              transition-all duration-200 ease-in-out
              my-3 px-5 py-2
              text-white font-bold font-[14px]
              hover:bg-white hover:text-green-500
              active:scale-95
              ring-2 ring-green-400
              rounded-[8px]
            "
          >
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
        <Input
          type="text"
          name="otp"
          placeHolder="OTP"
          value={formData.otp}
          onChange={handleChange}
        />
        <button
            type="submit"
            className="
              bg-green-500
              shadow-sm
              transition-all duration-200 ease-in-out
              my-3 px-5 py-2
              text-white font-bold font-[14px]
              hover:bg-white hover:text-green-500
              active:scale-95
              ring-2 ring-green-400
              rounded-[8px]
            "
          >
            Enter
          </button>
        </>
      )}
    </form>
  );
}

export default ForgetPassword;
