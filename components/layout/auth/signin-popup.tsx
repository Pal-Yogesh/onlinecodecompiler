import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X as CloseIcon } from "lucide-react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInData, signInSchema } from "@/schemas/signInSchema";
import OauthTemplate from "./OauthTemplate";

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    {children}
  </motion.div>
);

interface SignInPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInPopup: React.FC<SignInPopupProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        toast.error(`${error}`);
      }, 600);

      // Cleanup to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignInData> = async (data) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    // console.log("Sign-in Result", result);

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error(`Login Failed`);
      } else {
        toast.error(`${result?.error}`);
      }
    }

    if (result?.url) {
      onClose();
    //   router.replace("/compiler/javascript");
    }
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="z-[9999] w-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
            <div className="flex items-center justify-center mt-10  w-full">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-xl relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 text-primary-foreground hover:text-accent-foreground transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </motion.button>
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-foreground">
                    &lt; Log In to Continue /&gt;
                  </h2>
                </div>
                <form
                  className="mt-8 space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="sr-only">
                        Email
                      </label>
                      <div className="relative">
                        <IconWrapper>
                          <Mail className="w-5 h-5 text-muted-foreground" />
                        </IconWrapper>
                        <input
                          id="email"
                          type="text"
                          required
                          className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                          placeholder="Email"
                          {...register("email", { required: true })}
                        />
                      </div>
                      {errors.email && (
                        <span className="text-red-600">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <div className="relative">
                        <IconWrapper>
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </IconWrapper>
                        <input
                          id="password"
                          type="password"
                          required
                          className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                          placeholder="Password"
                          {...register("password", { required: true })}
                        />
                      </div>
                      {errors.password && (
                        <span className="text-red-600">
                          {errors.password.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                      <motion.div
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </motion.button>
                  </div>
                </form>

                <OauthTemplate />

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <motion.a
                      href="/sign-up"
                      className="font-medium text-primary hover:text-primary/80"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      &lt; Sign Up /&gt;
                    </motion.a>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SignInPopup;
