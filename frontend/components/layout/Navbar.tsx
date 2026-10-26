
// "use client";

// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";
// import { LogOut, Menu, Search, UserRound } from "lucide-react";

// import { Logo } from "@/components/ui/Logo";
// import { MobileMenu } from "@/components/layout/MobileMenu";
// import { cn } from "@/lib/utils";
// import { useTranslation, type Dict } from "@/lib/i18n";
// import { COMMON } from "@/lib/i18n/common";
// import { getMe, logout } from "@/service/auth";

// const NAV_LINKS: { label: Dict<string>; href: string }[] = [
//   { href: "/services", label: { bn: "সেবা", en: "Services" } },
//   {
//     href: "/how-it-works",
//     label: { bn: "কীভাবে কাজ করে", en: "How It Works" },
//   },
//   {
//     href: "/government-offices",
//     label: { bn: "সরকারি অফিস", en: "Government Offices" },
//   },
//   { href: "/notices", label: { bn: "নোটিশ", en: "Notices" } },
//   { href: "/faq", label: { bn: "সাহায্য", en: "Help" } },
// ];

// const STRINGS = {
//   bn: {
//     openMenu: "মেনু খুলুন",
//     closeMenu: "মেনু বন্ধ করুন",
//     dashboard: "ড্যাশবোর্ড",
//     logout: "লগআউট",
//   },
//   en: {
//     openMenu: "Open menu",
//     closeMenu: "Close menu",
//     dashboard: "Dashboard",
//     logout: "Logout",
//   },
// };

// export function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [user, setUser] = useState<{
//     name?: string;
//     role?: string;
//   } | null>(null);

//   const { lang, setLang, t } = useTranslation();
//   const c = t(COMMON);
//   const s = t(STRINGS);

//   useEffect(() => {
//     getMe()
//       .then((res) => {
//         if (res.success && res.data) {
//           setUser(res.data);
//         } else {
//           setUser(null);
//         }
//       })
//       .catch(() => setUser(null));
//   }, [pathname]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       setUser(null);
//       router.push("/");
//       router.refresh();
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const dashboardHref =
//     user?.role?.toUpperCase() === "ADMIN"
//       ? "/admin/dashboard"
//       : "/dashboard";

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);

//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });

//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // Close the drawer when the viewport grows back to desktop.
//   useEffect(() => {
//     if (!open) return;

//     const onResize = () => {
//       if (window.innerWidth >= 1024) {
//         setOpen(false);
//       }
//     };

//     window.addEventListener("resize", onResize);

//     return () => window.removeEventListener("resize", onResize);
//   }, [open]);

//   // Close the drawer on navigation.
//   useEffect(() => {
//     const timer = setTimeout(() => setOpen(false), 0);

//     return () => clearTimeout(timer);
//   }, [pathname]);

//   return (
//     <header
//       className={cn(
//         "sticky top-0 z-50 w-full bg-brand-700 transition-shadow duration-300",
//         scrolled ? "shadow-lg shadow-brand-900/20" : "",
//       )}
//     >
//       {/* Thin flag-red accent line */}
//       <div
//         className="h-[3px] w-full bg-flag-500"
//         aria-hidden="true"
//       />

//       <nav
//         aria-label="Main"
//         className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px] lg:px-8"
//       >
//         <Logo tone="light" />

//         {/* Desktop navigation links */}
//         <ul className="hidden items-center gap-0.5 lg:flex">
//           {NAV_LINKS.map((link) => {
//             const active =
//               pathname === link.href ||
//               pathname.startsWith(`${link.href}/`);

//             return (
//               <li key={link.href}>
//                 <Link
//                   href={link.href}
//                   aria-current={active ? "page" : undefined}
//                   className={cn(
//                     "group relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
//                     active
//                       ? "text-white"
//                       : "text-brand-50/80 hover:text-white",
//                   )}
//                 >
//                   {t(link.label)}

//                   <span
//                     aria-hidden="true"
//                     className={cn(
//                       "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-flag-500 transition-transform duration-250",
//                       active
//                         ? "scale-x-100"
//                         : "scale-x-0 group-hover:scale-x-100",
//                     )}
//                   />
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>

//         <div className="flex items-center gap-1.5 sm:gap-2">
//           {/* Search button */}
//           <Link
//             href="/search"
//             aria-label={c.searchServices}
//             className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-50/90 transition-colors hover:bg-white/10 hover:text-white"
//           >
//             <Search className="h-5 w-5" aria-hidden="true" />
//           </Link>

//           {/* Language toggle */}
//           <div
//             className="hidden items-center rounded-lg bg-white/10 p-0.5 text-xs font-bold md:flex"
//             role="group"
//             aria-label={c.language}
//           >
//             <button
//               type="button"
//               aria-pressed={lang === "bn"}
//               onClick={() => setLang("bn")}
//               className={cn(
//                 "rounded-md px-2.5 py-1.5 transition-colors",
//                 lang === "bn"
//                   ? "bg-white text-brand-800"
//                   : "text-brand-50/80 hover:text-white",
//               )}
//             >
//               বাংলা
//             </button>

//             <button
//               type="button"
//               aria-pressed={lang === "en"}
//               onClick={() => setLang("en")}
//               className={cn(
//                 "rounded-md px-2.5 py-1.5 transition-colors",
//                 lang === "en"
//                   ? "bg-white text-brand-800"
//                   : "text-brand-50/80 hover:text-white",
//               )}
//             >
//               EN
//             </button>
//           </div>

//           {/* Dashboard and logout buttons */}
//           {user ? (
//             <div className="hidden items-center gap-1.5 lg:inline-flex">
//               <Link
//                 href={dashboardHref}
//                 className="inline-flex h-10 items-center rounded-lg bg-white px-4 text-sm font-bold text-brand-800 shadow-sm transition-all hover:bg-brand-50"
//               >
//                 {s.dashboard}
//               </Link>

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 title={s.logout}
//                 aria-label={s.logout}
//                 className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-50/90 transition-colors hover:bg-white/10 hover:text-white"
//               >
//                 <LogOut
//                   className="h-4 w-4"
//                   aria-hidden="true"
//                 />
//               </button>
//             </div>
//           ) : (
//             <Link
//               href="/login"
//               className="hidden h-10 items-center gap-1.5 rounded-lg bg-white px-4 text-sm font-bold text-brand-800 shadow-sm transition-all hover:bg-brand-50 hover:shadow lg:inline-flex"
//             >
//               <UserRound
//                 className="h-4 w-4"
//                 aria-hidden="true"
//               />
//               {c.login}
//             </Link>
//           )}

//           {/* Mobile menu button */}
//           <button
//             type="button"
//             onClick={() => setOpen((value) => !value)}
//             aria-expanded={open}
//             aria-controls="mobile-menu"
//             aria-label={open ? s.closeMenu : s.openMenu}
//             className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-50 transition-colors hover:bg-white/10 lg:hidden"
//           >
//             <Menu className="h-6 w-6" aria-hidden="true" />
//           </button>
//         </div>
//       </nav>

//       <MobileMenu
//         open={open}
//         onClose={() => setOpen(false)}
//         links={NAV_LINKS}
//       />
//     </header>
//   );
// }

// export default Navbar;
