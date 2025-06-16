'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useHaptics } from '../../hooks/useHaptics';
import { Registro } from '../../types/registro';
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

type Status = 'livre' | 'trabalhando' | 'sobreaviso_nao_acionado' | 'sobreaviso_acionado';

interface QuickActionButtonsProps {
  status: Status;
  currentRegistro?: Registro;
  onEntrar: () => void;
  onSobreaviso: () => void;
  onSair: () => void;
  onAcionarSobreaviso?: () => void;
  onEncerrarSobreaviso?: () => void;
  disabled?: boolean;
  pulse?: boolean;
}

export function QuickActionButtons({
  status,
  currentRegistro,
  onEntrar,
  onSobreaviso,
  onSair,
  onAcionarSobreaviso,
  onEncerrarSobreaviso,
  disabled,
  pulse = false
}: QuickActionButtonsProps) {
  const isTrabalhando = status === 'trabalhando';
  const isSobreaviso = status === 'sobreaviso_nao_acionado' || status === 'sobreaviso_acionado';
  const { vibrateSuccess } = useHaptics();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if ((isTrabalhando || isSobreaviso) && !disabled) {
        vibrateSuccess();
        onSair();
      }
    },
    onSwipedRight: () => {
      if (!isTrabalhando && !isSobreaviso && !disabled) {
        vibrateSuccess();
        onEntrar();
      }
    },
    trackTouch: true,
    delta: 40
  });

  const handleAcionarSobreaviso = () => {
    if (
      window.confirm('Marcar sobreaviso como acionado? Isso registrará o horário de acionamento.')
    ) {
      vibrateSuccess();
      onAcionarSobreaviso?.();
    }
  };

  const handleEncerrarSobreaviso = () => {
    if (window.confirm('Encerrar sobreaviso antes do horário programado?')) {
      vibrateSuccess();
      onEncerrarSobreaviso?.();
    }
  };

  // Se estiver em sobreaviso, mostrar botões específicos
  if (isSobreaviso) {
    return (
      <div className="space-y-3">
        <div className="flex gap-3" {...handlers}>
          {status === 'sobreaviso_nao_acionado' ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAcionarSobreaviso}
              disabled={disabled}
              className={clsx(
                'flex flex-1 items-center justify-center gap-2 rounded-lg p-4 font-semibold text-white shadow-lg',
                disabled ? 'bg-gray-400' : 'animate-pulse bg-orange-500 hover:bg-orange-600'
              )}
            >
              <ExclamationTriangleIcon className="size-6" />
              Marcar como Acionado
            </motion.button>
          ) : (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-orange-300 bg-orange-100 p-4">
              <ExclamationTriangleIcon className="size-6 text-orange-600" />
              <span className="font-semibold text-orange-800">Sobreaviso Acionado</span>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleEncerrarSobreaviso}
            disabled={disabled}
            className={clsx(
              'flex flex-1 items-center justify-center gap-2 rounded-lg p-4 font-semibold text-white shadow-lg',
              disabled ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            )}
          >
            <ArrowLeftOnRectangleIcon className="size-6" />
            Encerrar
          </motion.button>
        </div>

        {currentRegistro?.sobreavisoFim && (
          <div className="rounded-lg bg-purple-50 p-2 text-center text-sm text-gray-600">
            <ClockIcon className="mr-1 inline size-4" />
            Programado até: {currentRegistro.sobreavisoFim}
          </div>
        )}
      </div>
    );
  }

  // Botões padrão para outras situações
  return (
    <div className="flex gap-3" {...handlers}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          vibrateSuccess();
          onEntrar();
        }}
        disabled={isTrabalhando || isSobreaviso || disabled}
        className={clsx(
          'flex flex-1 items-center justify-center gap-2 rounded-lg p-4 font-semibold text-white shadow-lg',
          isTrabalhando || isSobreaviso || disabled
            ? 'bg-gray-400'
            : 'bg-green-500 hover:bg-green-600',
          pulse && !isTrabalhando && !isSobreaviso ? 'animate-pulse' : ''
        )}
      >
        <ArrowRightOnRectangleIcon className="size-6" />
        Entrar
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          vibrateSuccess();
          onSair();
        }}
        disabled={!isTrabalhando || disabled}
        className={clsx(
          'flex flex-1 items-center justify-center gap-2 rounded-lg p-4 font-semibold text-white shadow-lg',
          !isTrabalhando || disabled ? 'bg-gray-400' : 'animate-pulse bg-red-500 hover:bg-red-600'
        )}
      >
        <ArrowLeftOnRectangleIcon className="size-6" />
        Sair
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          vibrateSuccess();
          onSobreaviso();
        }}
        disabled={isTrabalhando || isSobreaviso || disabled}
        className={clsx(
          'flex flex-1 items-center justify-center gap-2 rounded-lg p-4 font-semibold text-white shadow-lg',
          isTrabalhando || isSobreaviso || disabled
            ? 'bg-gray-400'
            : 'bg-purple-500 hover:bg-purple-600'
        )}
      >
        <ShieldCheckIcon className="size-6" />
        Sobreaviso
      </motion.button>
    </div>
  );
}
