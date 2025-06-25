import forge from 'node-forge';
import { config } from '../config';

export async function verifyData(response: any, nonce: string): Promise<boolean> {

  const key = config.value.NEXT_PRIVATE_PUBLIC_DECRYPTION_KEY;

  const data = response.data;
  const status = response.status;
  const headers = response.headers;

  const signature = headers['hash'];
  const encodedData = forge.util.encode64(data);

  const originalContent = `${nonce}${status}${encodedData}`;

  const publicKeyAsn1 = forge.asn1.fromDer(forge.util.decode64(key));
  const publicKey = forge.pki.publicKeyFromAsn1(publicKeyAsn1);
  const md = forge.md.sha256.create();

  md.update(originalContent, 'utf8');

  return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature));
}