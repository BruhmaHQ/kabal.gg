import { TxnBuilderTypes, HexString, BCS , TypeTagParser} from 'aptos';
import { SupraClient } from '../libs/supraAdk/browser';

type AnyNumber = number | bigint;


function convertArgsToUint8Array(args: any[]): Uint8Array[] {
    return args.map(arg => {
        if (typeof arg === 'string' && arg.startsWith('0x')) {
            // Handle hex strings (addresses)
            return new HexString(arg).toUint8Array();
        } else if (typeof arg === 'number' || typeof arg === 'bigint') {
            // Handle numbers and bigints
            return BCS.bcsSerializeUint64(BigInt(arg));
        } else if (Array.isArray(arg)) {
            // Handle arrays of numbers (vectors)
            const serializer = new BCS.Serializer();
            // Write the length of the vector
            serializer.serializeU32AsUleb128(arg.length);
            // Write each element
            arg.forEach((item: AnyNumber) => {
                serializer.serializeU64(BigInt(item));
            });
            return serializer.getBytes();
        }
        // Add more type conversions as needed
        throw new Error(`Unsupported argument type: ${typeof arg}`);
    });
}

export async function createTxHexData(
    senderAddr: string,
    moduleAddr: string,
    moduleName: string,
    functionName: string,
    functionTypeArgs: string[],
    functionArgs: any[]
): Promise<string> {


    try {
        const supraClient = new SupraClient(config.nodeUrl);
        // Get sequence number
        const accountInfo = await supraClient.getAccountInfo(
            new HexString(senderAddr)
        );

        // Convert function arguments to Uint8Array
        const convertedArgs = convertArgsToUint8Array(functionArgs);

        const type_arguments : TxnBuilderTypes.TypeTag[] = [];
        for (const type_arg of functionTypeArgs) {
            const type_tag = new TypeTagParser(type_arg);
            type_arguments.push(type_tag.parseTypeTag());
        }

        // const chainId = await supraClient.getChainId();

        // Create serialized raw transaction
        const serializedRawTx = await supraClient.createSerializedRawTxObject(
            new HexString(senderAddr),
            accountInfo.sequence_number,
            moduleAddr,
            moduleName,
            functionName,
            type_arguments,
            convertedArgs,
            // chainId
        );

        // const hexString = Buffer.from(serializedRawTx).toString('hex');
        const hexString = uint8ArrayToHex(serializedRawTx);

        return hexString;

    } catch (error) {
        console.error('Error sending transaction:', error);
        throw error;
    }

    function uint8ArrayToHex(uint8Array: Uint8Array): string {
        return Array.from(uint8Array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }




}