import { useState, useRef, FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast, { Toaster } from "react-hot-toast";
import Button from "../../Button";
import { auth, provider, signInWithPopup } from "../../../../firebase";


const SignUpForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSignUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = recaptchaRef.current?.getValue();
    console.log(token)
    if (!token) {
      toast.error("Please verify that you are not a robot");
      return;
    }
    
    //console.log({ name, email, username, password });
  };
  const handleGoogleSignUp = async () => {
    try {
       const result = await signInWithPopup(auth, provider);
       const idToken = await result.user.getIdToken();
       //console.log(result);
       console.log(idToken);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
      <div>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="flex justify-center w-full ">
        <ReCAPTCHA sitekey="6Le-D-8qAAAAAHinvtdVoVWtZg-bur5V3dDw2V3r" ref={recaptchaRef} />
        <Toaster />
      </div>
      <Button type="submit" className="" id=""  onClick={() => {}}>Sign Up</Button>
      <button onClick={handleGoogleSignUp} className="google-signup-button rounded-full p-3 m-2 flex items-center justify-center gap-2 border border-gray-400 rounded py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        <img
          src="/Images/google.svg"
          alt="Google Logo"
          className="google-logo"
        />Continue with Google
      </button>
    </form>
  );
};

export default SignUpForm;
