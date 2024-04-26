import { useEffect, useState } from "react";

import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { readContracts } from '@wagmi/core'

import lendAbi from "../../lukso/abis/lend_abi.json";
import mpAbi from "../../lukso/abis/mp_abi.json";
import lsp7Abi from "../../lukso/abis/lsp7_abi.json";
import lsp8Abi from "../../lukso/abis/lsp8_abi.json";

import Av from "../../assets/background/avatar.png"

const lendAddress = '0x52d74783C95c6CCBb9F80dCF1AC3dB4788AabB6b';
const adminAddress = '0xa842a38CD758f8dE8537C5CBcB2006DB0250eC7C';

const mpAddress = '0x85598432f2287046785E7bC47Bb37135c2Decc8D';
const lsp8Address = '0xB64a1A593830De953Cf0f7D1EE18f02C47b54481';
const lsp7Address = '0x151B5bD19373c16130f4F02488BE96bb36269298';

export const useLoans = () => {

    const [refetch, setRefetch] = useState(false);

    const [loans, setLoans] = useState([]);

    const { data: loanIdCounter } = useContractRead({
        address: lendAddress,
        abi: lendAbi,
        functionName: 'loanIdCounter',
        args: [
        ],
    })

    const { writeAsync: extendLoan } = useContractWrite({
        address: lendAddress,
        abi: lendAbi,
        functionName: 'extendLoan',
    })
    
    const { writeAsync: liquidateLoan } = useContractWrite({
        address: lendAddress,
        abi: lendAbi,
        functionName: 'liquidateLoan',
    })

    const { writeAsync: repayLoan } = useContractWrite({
        address: lendAddress,
        abi: lendAbi,
        functionName: 'repayLoan',
    })

    const { writeAsync: acceptLoan } = useContractWrite({
        address: lendAddress,
        abi: lendAbi,
        functionName: 'acceptLoan',
    })

    const { writeAsync: revokeLoan } = useContractWrite({
        address: lendAddress,
        abi: lendAbi,
        functionName: 'revokeLoan',
    })

    const { writeAsync: offerLoan } = useContractWrite({
        address: lendAddress,
        abi: lendAbi,
        functionName: 'offerLoan',
    })

    const fetchLoans = async () => {
        let tmpLoans = [];
        let contracts = [];
        for (let i = 0; i < loanIdCounter; i++) {
            contracts.push({
                address: lendAddress,
                abi: lendAbi,
                functionName: 'loans',
                args: [i]
            });
        }
        const data = await readContracts({ contracts });
        data.map((item) => {
            if (item.status == 'success') {
                tmpLoans.push({
                    nftAddress: item.result[0],
                    lender: item.result[1],
                    borrower: item.result[2],
                    loanId: Number(item.result[3]),
                    duration: Number(item.result[4]),
                    amount: Number(item.result[5]),
                    interest: Number(item.result[6]),                    
                    durationCounter: Number(item.result[7]),
                    tokenId: item.result[8],
                    accepted: item.result[9],
                    paid: item.result[10],
                    liquidated: item.result[11]
                });
            }
        })
        setLoans(tmpLoans);

        console.log(tmpLoans);
    }

    useEffect(() => {
        const timerID = setInterval(() => {
            setRefetch((prevData) => {
                return !prevData;
            })
        }, 10000);

        return () => {
            clearInterval(timerID);
        };
    }, []);

    useEffect(() => {
        if (loanIdCounter) {
            fetchLoans();
        }
    }, [loanIdCounter, refetch])

    return { adminAddress, loans, loanIdCounter, offerLoan, revokeLoan, acceptLoan, repayLoan, liquidateLoan, extendLoan };
};
