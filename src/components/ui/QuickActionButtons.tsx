'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { useHaptics } from '../../hooks/useHaptics';

type Status = 'livre' | 'trabalhando' | 'sobreaviso_nao_acionado' | 'sobreaviso_acionado';

interface QuickActionButtonsProps {
  status: Status;
  onEntrar: () => void;
  onSobreaviso: () => void;
  onSair: () => void;
  disabled?: boolean;
  pulse?: boolean;
}

export function QuickActionButtons({
  status,
  onEntrar,
  onSobreaviso,
  onSair,
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

  return (
    <div className="flex gap-3" {...handlers}>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          vibrateSuccess();
          onEntrar();
        }}
        disabled={isTrabalhando || disabled}
        className={clsx(
          'flex-1 rounded py-3 font-semibold text-white shadow',
          isTrabalhando || disabled ? 'bg-gray-400' : 'bg-success-500',
          pulse && !isTrabalhando ? 'animate-pulse' : ''
        )}
      >
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
          'flex-1 rounded py-3 font-semibold text-white shadow',
          !isTrabalhando || disabled ? 'bg-gray-400' : 'bg-error-500 animate-pulse'
        )}
      >
        Sair
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          vibrateSuccess();
          onSobreaviso();
        }}
        disabled={isTrabalhando || disabled}
        className={clsx(
          'flex-1 rounded py-3 font-semibold text-white shadow',
          isSobreaviso ? 'bg-warning-500' : 'bg-info-500'
        )}
      >
        {status === 'sobreaviso_nao_acionado' ? 'Acionado' : 'Sobreaviso'}
      </motion.button>
    </div>
  );
}
