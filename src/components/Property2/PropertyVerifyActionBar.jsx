import React from "react";

/**
 * Barra compacta de verificación del predio (evita la tarjeta vacía a ancho completo).
 */
export default function PropertyVerifyActionBar({
  isVerifier,
  status,
  isLoading,
  verificationGate,
  onVerify,
}) {
  const showTerminalStatus = ["APPROVED", "REJECTED", "NOT_SELECTABLE"].includes(
    status
  );

  if (!isVerifier && !showTerminalStatus) {
    return null;
  }

  const statusConfig = {
    APPROVED: {
      label: "Predio aprobado",
      className: "bg-terrasacha-secondary2 text-white",
    },
    REJECTED: {
      label: "Predio rechazado",
      className: "bg-terrasacha-danger text-white",
    },
    NOT_SELECTABLE: {
      label: "Predio no elegible",
      className: "bg-terrasacha-danger text-white",
    },
  };

  const terminal = statusConfig[status];
  const canVerify = Boolean(verificationGate?.isReady);

  return (
    <section
      className="bg-white rounded-xl border border-terrasacha-light/30 shadow-sm p-3 sm:p-4"
      aria-label="Verificación del predio"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-terrasacha-primary font-typographica mb-1">
            Verificación del predio
          </p>
          {terminal ? (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold font-typographica ${terminal.className}`}
            >
              {terminal.label}
            </span>
          ) : isVerifier && !canVerify ? (
            <p
              className="text-xs sm:text-sm text-terrasacha-danger font-typographica mb-0 leading-snug"
              role="status"
            >
              ⚠ {verificationGate?.message}
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-terrasacha-secondary1 font-typographica mb-0 opacity-80">
              Los pasos del predio están completos. Puedes aprobar o rechazar.
            </p>
          )}
        </div>

        {isVerifier && (
          <button
            type="button"
            className={`btn-terrasacha-primary px-6 py-2.5 font-typographica w-full sm:w-auto sm:min-w-[160px] flex-shrink-0 ${
              !canVerify || isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={onVerify}
            disabled={isLoading || !canVerify}
            aria-label="Verificar predio"
            aria-disabled={isLoading || !canVerify}
          >
            {isLoading ? "Procesando..." : "Verificar"}
          </button>
        )}
      </div>
    </section>
  );
}
