import { encodeFunctionData, decodeFunctionResult, type Address } from 'viem';
import { MULTICALL3_ADDRESS } from './blockchain-constants';

// Minimal Multicall3 ABI - just what we need
export const MULTICALL3_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'target', type: 'address' },
          { name: 'allowFailure', type: 'bool' },
          { name: 'callData', type: 'bytes' }
        ],
        name: 'calls',
        type: 'tuple[]'
      }
    ],
    name: 'aggregate3',
    outputs: [
      {
        components: [
          { name: 'success', type: 'bool' },
          { name: 'returnData', type: 'bytes' }
        ],
        name: 'returnData',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  }
] as const;

interface Call {
  target: Address;
  abi: any;
  functionName: string;
  args?: any[];
}

// Simple multicall function - no retry logic, just basics
export async function simpleMulticall(
  publicClient: any,
  calls: Call[]
) {
  // Encode all calls
  const multicallData = calls.map(call => ({
    target: call.target,
    allowFailure: true, // Don't fail entire batch if one fails
    callData: encodeFunctionData({
      abi: call.abi,
      functionName: call.functionName,
      args: call.args || []
    })
  }));

  // Execute multicall
  const results = await publicClient.readContract({
    address: MULTICALL3_ADDRESS,
    abi: MULTICALL3_ABI,
    functionName: 'aggregate3',
    args: [multicallData]
  });

  // Decode results
  return results.map((result: any, index: number) => {
    if (!result.success) {
      return { success: false, data: null };
    }

    try {
      const decoded = decodeFunctionResult({
        abi: calls[index].abi,
        functionName: calls[index].functionName,
        data: result.returnData
      });
      return { success: true, data: decoded };
    } catch (error) {
      return { success: false, data: null };
    }
  });
}