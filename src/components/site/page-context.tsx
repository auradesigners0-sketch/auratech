"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type PageId =
  | "home"
  | "about"
  | "services"
  | "work"
  | "contact"
  | "case-study"
  | "blog";

type Ctx = {
  page: PageId;
  setPage: (p: PageId) => void;
  caseStudySlug: string | null;
  openCaseStudy: (slug: string) => void;
};

const PageContext = createContext<Ctx>({
  page: "home",
  setPage: () => {},
  caseStudySlug: null,
  openCaseStudy: () => {},
});

export function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPageState] = useState<PageId>("home");
  const [caseStudySlug, setCaseStudySlug] = useState<string | null>(null);

  const setPage = useCallback((p: PageId) => {
    setPageState(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const openCaseStudy = useCallback(
    (slug: string) => {
      setCaseStudySlug(slug);
      setPageState("case-study");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    []
  );

  // Sync URL hash with the current page so users can share/bookmark
  // section anchors. We use the hash so the sandbox's single-route
  // constraint is respected — the URL stays on `/` but reads as
  // `/#/about`, `/#/services`, `/#/case-study/<slug>`, etc.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => {
      const raw = window.location.hash.replace(/^#\/?/, "");
      // Handle case-study/<slug> URLs
      const [hashPage, hashSlug] = raw.split("/");
      const valid: PageId[] = [
        "home",
        "about",
        "services",
        "work",
        "contact",
        "case-study",
        "blog",
      ];
      if (valid.includes(hashPage as PageId)) {
        setPageState(hashPage as PageId);
        if (hashPage === "case-study" && hashSlug) {
          setCaseStudySlug(hashSlug);
        }
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Update the URL hash whenever the page or case study changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    let target = "/";
    if (page === "case-study" && caseStudySlug) {
      target = `#/case-study/${caseStudySlug}`;
    } else if (page !== "home") {
      target = `#/${page}`;
    }
    if (window.location.hash !== target && `#${window.location.hash.slice(1)}` !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [page, caseStudySlug]);

  return (
    <PageContext.Provider
      value={{ page, setPage, caseStudySlug, openCaseStudy }}
    >
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  return useContext(PageContext);
}
