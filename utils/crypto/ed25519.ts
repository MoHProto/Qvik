import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';

ed.hashes.sha512 = sha512;
ed.hashes.sha512Async = async (message) => sha512(message);

export function createEd25519SeedHex(): string {
  return ed.etc.bytesToHex(ed.utils.randomSecretKey());
}

