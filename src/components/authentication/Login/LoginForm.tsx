import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../../services/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const queryClient = useQueryClient();

	interface UserData {
		username: string;
		password: string;
	}

	interface ErrorResponse {
		response?: {
			data?: {
				message?: string;
			};
		};
	}

	const loginMutation = useMutation({
		mutationFn: async (userData: UserData) => {
			const response = await axiosInstance.post("/auth/login", userData);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			toast.success("Login successful!");
		},
		onError: (err: unknown) => {
			const error = err as ErrorResponse;
			toast.error(error.response?.data?.message || "Something went wrong");
		},
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginMutation.mutate({ username, password });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="input input-bordered w-full"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="input input-bordered w-full"
				required
			/>

			<button type="submit" className="btn btn-primary w-full" disabled={loginMutation.isPending}>
				{loginMutation.isPending ? <Loader className="size-5 animate-spin" /> : "Login"}
			</button>
		</form>
	);
};

export default LoginForm;
