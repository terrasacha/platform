import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { privacyContent } from "components/common/TermsModal";

export default function PrivacyPolicy() {
  return (
    <div className="pt-8 px-4 pb-4 sm:pt-6 sm:px-6 sm:pb-6 lg:pt-8 lg:px-8 lg:pb-8 mx-auto font-typographica">
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-terrasacha-light/20">
        <h1 className="text-2xl sm:text-3xl font-bold text-terrasacha-primary text-center mb-4">
          Política de Privacidad
        </h1>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h2 className="text-xl font-bold text-terrasacha-primary mb-4">
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h3 className="text-lg font-bold text-terrasacha-secondary1 mb-3 mt-5">
                  {children}
                </h3>
              ),
              h3: ({ children }) => (
                <h4 className="text-base font-semibold text-terrasacha-primary mb-2 mt-4">
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className="text-sm text-gray-700 leading-relaxed mb-2">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-sm text-gray-700 leading-relaxed">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-terrasacha-primary">{children}</strong>
              ),
              hr: () => (
                <hr className="border-t border-terrasacha-light my-6" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-terrasacha-secondary2 bg-terrasacha-light/10 p-4 rounded-r-lg my-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {privacyContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
