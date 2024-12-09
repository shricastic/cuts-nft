import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL,
);

console.log("loaded user", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("set up Umi instance for user");

const collectionAddress = publicKey(
  "2aRPJzibSJkVcjx4uVz9WZYMaYRauwzrjdb8GZFkTK8y",
);
console.log("creating nft member in Cuts collection");

const mint = generateSigner(umi);
const transaction = await createNft(umi, {
  mint,
  name: "Cuts Nft Behelit",
  uri: "https://raw.githubusercontent.com/shricastic/cuts-nft/refs/heads/master/collection-member-metadata.json",
  sellerFeeBasisPoints: percentAmount(0),
  collection: {
    key: collectionAddress,
    verified: false,
  },
});

await transaction.sendAndConfirm(umi);

console.log(
  `Member Nft created in Cuts collection and Address is: ${getExplorerLink(
    "address",
    createNft.mint.publicKey,
    "devnet",
  )}`,
);

console.log("Done");
