import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast, { Toaster } from "react-hot-toast";
import Button from "../../../generalComponets/Button";

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const recaptchaRef = useRef(null);

  const handleSignUp = (e) => {
    e.preventDefault();
    const token = recaptchaRef.current.getValue();
    if (!token) {
      toast.error("Please verify that you are not a robot");
      return;
    }
    console.log({ name, email, username, password });
  };

  return (
    <form className="flex flex-col gap-4 " onSubmit={handleSignUp}>
      <div >
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
      <ReCAPTCHA
        sitekey="6Le-D-8qAAAAAHinvtdVoVWtZg-bur5V3dDw2V3r"
        ref={recaptchaRef}
      />
      <Toaster />

      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpForm;
