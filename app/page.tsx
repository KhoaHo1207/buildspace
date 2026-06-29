"use client";

import { Button } from "@/components/ui/button";
import { features, footerLinks, stats, steps, testimonials } from "@/constants";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Code,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-100 via-indigo-100 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-purple-500 border-t-transparent"
        />
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-purple-50 via-white to-indigo-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-purple-200 opacity-30 mix-blend-multiply blur-3xl filter" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-indigo-200 opacity-30 mix-blend-multiply blur-3xl filter delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-pink-200 opacity-20 mix-blend-multiply blur-3xl filter delay-2000" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 container mx-auto flex items-center justify-between px-4 py-6"
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-indigo-600 shadow-lg"
          >
            <Code className="h-5 w-5 text-white" />
          </motion.div>
          <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
            BuildSpace
          </span>
        </div>

        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-purple-600"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </SignUpButton>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-100 px-4 py-2"
          >
            <Zap className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">
              Launching Soon
            </span>
          </motion.div>

          <h1 className="mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
            Learn by Building
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
            Master modern web development through hands-on projects, earn
            achievements, compete with friends, and level up your career.
          </p>

          <div className="flex items-center justify-center gap-4">
            <SignUpButton mode="modal">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  size="lg"
                  className="bg-linear-to-r from-purple-600 to-indigo-600 px-8 text-lg text-white shadow-lg hover:shadow-xl"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </SignUpButton>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
            >
              <stat.icon
                className={`h-8 w-8 text-${stat.color}-600 mx-auto mb-3`}
              />
              <div className={`text-3xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose BuildSpace?
          </h2>
          <p className="mt-4 text-gray-600">
            Everything you need to become a developer
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-purple-100 to-indigo-100 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-gray-600">Get started in 4 simple steps</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <div className="relative">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-8 -right-4 hidden md:block">
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="mb-2 text-4xl font-bold text-purple-600">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Loved by Developers
          </h2>
          <p className="mt-4 text-gray-600">
            Join thousands of successful learners
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-4 text-gray-700">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-indigo-600">
                  <span className="font-bold text-white">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 p-12 text-center shadow-xl"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Limited Time Offer
              </span>
            </motion.div>

            <h2 className="mb-4 text-4xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
              Join thousands of developers who are already building their future
              with BuildSpace
            </p>

            <SignUpButton mode="modal">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white px-8 text-lg text-purple-600 shadow-lg hover:bg-gray-100"
                >
                  Get Started For Free
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </SignUpButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-indigo-600">
                <Code className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">BuildSpace</span>
            </div>
            <div className="flex gap-6">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-600 transition-colors hover:text-purple-600"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              © 2026 BuildSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
