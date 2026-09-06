import LoginForm from "../components/login/LoginForm.tsx"

function Login() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="mb-6 text-3xl font-bold">Log <span className="text-green-500">In</span></h1>
      <LoginForm />
    </div>
  )
}

export default Login
