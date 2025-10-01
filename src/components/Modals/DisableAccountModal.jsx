import React, { useState } from 'react';
import { UserAccountDisableService } from '../../services/disableUserAccount';

const DisableAccountModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  user 
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Si no hay usuario aún, no renderizar
  if (!user) return null;

  // Verificar que el usuario puede desactivar su cuenta
  const isAllowed = UserAccountDisableService.canDisableAccount(user);

  const handleDisableAccount = async () => {
    if (confirmationText !== 'DESACTIVAR') {
      setError('Debe escribir "DESACTIVAR" para confirmar');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userId = user?.attributes?.sub || user?.id;
      const result = await UserAccountDisableService.disableUserAccount(
        userId, 
        confirmationText
      );

      if (result.success) {
        onSuccess(result.message);
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error inesperado al desactivar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 w-full max-w-md mx-4">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100 font-typographica">
            ¿Estás absolutamente seguro?
          </h3>
          {!isAllowed ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Solo los usuarios con rol <strong>constructor</strong> pueden desactivar su cuenta.
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Esta acción es irreversible. Se eliminarán todos tus datos de forma permanente. Para confirmar, por favor escribe <strong className="text-red-600 dark:text-red-400">DESACTIVAR</strong> en el campo de abajo.
            </p>
          )}
        </div>
        
        {isAllowed && (
        <div className="mt-6">
          <label className="sr-only" htmlFor="confirm_text">Confirmación</label>
          <input
            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-center font-bold tracking-widest focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-gray-100"
            id="confirm_text"
            placeholder="DESACTIVAR"
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
          />
        </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleClose}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          {isAllowed && (
            <button
              onClick={handleDisableAccount}
              disabled={confirmationText !== 'DESACTIVAR' || isLoading}
              className="w-full bg-red-600 dark:bg-red-500 text-white dark:text-black font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-red-400 dark:disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Desactivando...' : 'Entiendo, desactivar mi cuenta'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisableAccountModal;
