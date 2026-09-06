import LoginForm from "../components/login/LoginForm.tsx"

function Login() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-800">
        Log <span className="text-green-600">In</span>
      </h1>
      <LoginForm />
    </div>
  )
}

export default Login

