'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            }
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.exportCsv = void 0;
const functions = __importStar(require('firebase-functions'));
const firestore_1 = require('firebase-admin/firestore');
const storage_1 = require('firebase-admin/storage');
const papaparse_1 = __importDefault(require('papaparse'));
const date_fns_1 = require('date-fns');
const admin = __importStar(require('firebase-admin'));
if (admin.apps.length === 0) {
  admin.initializeApp();
}
exports.exportCsv = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }
  const uid = context.auth.uid;
  const month = data.month; // formato YYYY-MM
  if (!month) {
    throw new functions.https.HttpsError('invalid-argument', 'Parâmetro month é obrigatório');
  }
  const db = (0, firestore_1.getFirestore)();
  const start = `${month}-01`;
  const registrosSnap = await db
    .collection('registros')
    .where('usuarioId', '==', uid)
    .where('data', '>=', start)
    .get();
  const registros = registrosSnap.docs.map((d) => d.data());
  const csv = papaparse_1.default.unparse(registros);
  const storage = (0, storage_1.getStorage)().bucket();
  const filename = `reports/${uid}/${(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`;
  const file = storage.file(filename);
  await file.save(csv, { contentType: 'text/csv' });
  await file.makePublic();
  const url = file.publicUrl();
  return { url };
});
