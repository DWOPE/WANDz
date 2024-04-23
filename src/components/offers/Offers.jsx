import React, { useState } from "react";
import Nav from "../global/Nav";
import VideoBG from "../global/VideoBG";
import { MdArrowDownward } from "react-icons/md";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import LendDlgBanner from "../../assets/background/lendDlgBanner.png";

import { collections } from "../../data/collections";

import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core'
import { parseEther, formatUnits } from 'viem';
import { useLoans } from "../../hooks/wandz-eth";

function Offers() {

  const [selectedLend, setSelectedLend] = useState(-1);
  const [revokePending, setRevokePending] = useState(false);

  const account = useAccount();

  const loans = useLoans();

  const onRevokeOffer = (lendIndex) => {
    setSelectedLend(lendIndex);
  }

  const revokeOffer = async () => {
    if (account.address) {
      setRevokePending(true);
      try {

        const result = await loans.revokeLoan({
          args: [loans.loans[selectedLend].loanId],
          from: account.address
        })
        console.log("revokeLoan:", result);
      } catch (error) {
        console.log(error);
      }
      setRevokePending(false);
      setSelectedLend(-1);
    }
  }

  return (
    <>
      <div className="offers-page pb-[30px]">
        {/* <VideoBG /> */}
        <Nav btnText={"Select Profile"} />
        <div className="container relative">
          <div className="text-section font-superLagendBoy text-center pt-36 pb-20">
            <h1 className="text-[2.5rem] sm:text-[2rem] max-sm:text-[1.5rem] sm:p-4 text-gradient-bg leading-loose">
              MY OFFERS AND CONTRACTS
            </h1>
            <p className="font-superLagendBoy text-xl max-sm:text-lg text-[#FFFFFF]">
              Once your offer is accepted by a borrower, a secure contract is created, freezing the NFT in their wallet. When the loan ends, you will get paid the total LYX (loan with interest). In the event of a default, you can foreclose, which transfers the collateral NFT to your wallet.
            </p>
            {loans.loans.filter((loan) => loan.lender == account.address && loan.amount != 0 && !loan.accepted && !loan.paid && !loan.liquidated).length == 0 && <h1 className="mt-24 font-superLagendBoy text-4xl max-sm:text-lg text-[#FFFFFF]">No active or completed loans.</h1>}
          </div>
          <div className="second-sec py-16 flex flex-col gap-24">
            <div>
              <h1 className=" font-superLagendBoy flex gap-2 text-[#FFFFFF] items-center text-sm">
                Download history (CSV){" "}
                <span className="cursor-pointer">
                  <MdArrowDownward color="#DBFF00" size={20} />
                </span>
              </h1>
            </div>

            <div className="boxes max-sm:px-2">

              <div className="flex max-sm:flex-col gap-4 max-sm:gap-4 justify-between ">

                <div className="text-[#FFFFFF] rounded-lg border border-[#DBFF00] border-b-[6px] font-superLagendBoy backdrop-blur-3xl p-6 py-6 pr-10 flex flex-col">
                  <h1 className="text-[10px]">
                    TOTAL INTEREST EARNED (ALL TIME)
                  </h1>
                  <div className="flex flex-col justify-between mt-4">
                    <h1 className="flex gap-2 items-center">
                      <span className="text-3xl">Ŀ</span>
                      <span className="text-xl">0</span>
                    </h1>
                    <span className="text-[10px]">0 active loans</span>
                  </div>
                </div>

                <div className="text-[#FFFFFF] rounded-lg border border-[#DBFF00] border-b-[6px] font-superLagendBoy backdrop-blur-3xl p-6 py-6 pr-10 flex flex-col">
                  <h1 className="text-[10px]">
                    TOTAL ACTIVE LOAN VALUE
                  </h1>
                  <div className="flex flex-col justify-between mt-4">
                    <h1 className="flex gap-2 items-center">
                      <span className="text-3xl">Ŀ</span>
                      <span className="text-xl">0</span>
                    </h1>
                    <span className="text-[10px]">0 active loans</span>
                  </div>
                </div>

                <div className="text-[#FFFFFF] rounded-lg border border-[#DBFF00] border-b-[6px] font-superLagendBoy backdrop-blur-3xl p-6 py-6 pr-10 flex flex-col">
                  <h1 className="text-[10px]">
                    TOTAL OFFER VALUE
                  </h1>
                  <div className="flex flex-col justify-between mt-4">
                    <h1 className="flex gap-2 items-center">
                      <span className="text-3xl">Ŀ</span>
                      <span className="text-xl">0</span>
                    </h1>
                    <span className="text-[10px]">0 active loans</span>
                  </div>
                </div>

                <div className="text-[#FFFFFF] rounded-lg border border-[#DBFF00] border-b-[6px] font-superLagendBoy backdrop-blur-3xl p-6 py-6 pr-10 flex flex-col">
                  <h1 className="text-[10px]">
                    FACECLOSURE RATE
                  </h1>
                  <div className="flex flex-col justify-between mt-4">
                    <h1 className="flex gap-2 items-center">
                      <span className="text-3xl">Ŀ</span>
                      <span className="text-xl">0</span>
                    </h1>
                    <span className="text-[10px]">0 active loans</span>
                  </div>
                </div>

                <div className="text-[#FFFFFF] rounded-lg border border-[#DBFF00] border-b-[6px] font-superLagendBoy backdrop-blur-3xl p-6 py-6 pr-10 flex flex-col">
                  <h1 className="text-[10px]">
                    UNDER WATER
                  </h1>
                  <div className="flex flex-col justify-between mt-4">
                    <h1 className="flex gap-2 items-center">
                      <span className="text-3xl">0</span>
                      <span className="text-xl">loans</span>
                    </h1>
                    {/* <span className="text-[10px]">0 active loans</span> */}
                  </div>
                </div>

              </div>
            </div>
          </div>
          {loans.loans.filter((loan) => loan.lender == account.address && loan.amount != 0 && !loan.accepted && !loan.paid && !loan.liquidated).length != 0 &&
            <div className="flex flex-col gap-[20px] rounded-[30px] bg-[#383D7257] backdrop-blur-sm p-[30px]">
              <div className="flex items-center gap-[10px]">
                <span className="w-3/12 text-[16px] font-bold text-white">COLLECTION</span>
                <span className="w-2/12 text-[16px] font-bold text-white">Offer</span>
                <span className="w-2/12 text-[16px] font-bold text-white">Reward</span>
                <span className="w-2/12 text-[16px] font-bold text-white">APY</span>
                <span className="w-2/12 text-[16px] font-bold text-white">Status</span>
                <span className="w-1/12 text-[16px] font-bold text-white"></span>
              </div>
              <div className="flex flex-col gap-[10px]">
                {loans.loans.map((item, index) => (
                  item.lender == account.address && item.amount != 0 && !item.accepted && !item.paid && !item.liquidated && <div className="flex items-center gap-[10px]">
                    <div className="w-3/12 flex gap-[20px] items-center">
                      <img className="w-[35px] h-[35px] object-contain" src={collections.find((collection) => collection.address == item.nftAddress).avatar} alt="loan" />
                      <span className="text-[11px] font-bold text-white">{collections.find((collection) => collection.address == item.nftAddress).name}</span>
                    </div>
                    <div className="w-2/12 flex gap-[5px] items-center">
                      <span className="text-[12px] font-bold text-white">Ŀ</span>
                      <span className="text-[12px] font-bold text-[#DBFF00]">{formatUnits(item.amount, 18)}</span>
                    </div>
                    <div className="w-2/12 flex gap-[5px] items-center">
                      <span className="text-[12px] font-bold text-white">Ŀ</span>
                      <span className="text-[12px] font-bold text-white">{formatUnits(item.amount * item.interest / 100, 18)}</span>
                    </div>
                    <div className="w-2/12 flex gap-[5px] items-center">
                      <span className="text-[12px] font-bold text-white">{item.interest}</span>
                      <span className="text-[12px] font-bold text-white">%</span>
                    </div>
                    <div className="w-2/12 flex gap-[5px] items-center">
                      <span className="text-[12px] font-bold text-white">Seeking Borrower</span>
                    </div>
                    <div className="w-1/12 flex gap-[5px] items-center">
                      <button onClick={(e) => { onRevokeOffer(index) }} className="bg-gradient-to-r from-[#159F2C] text-black px-6 py-2 max-sm:text-[11px] max-sm:px-4 rounded-lg to-[#DBFF00]">Revoke</button>
                    </div>
                  </div>
                )
                )}
              </div>
            </div>}
        </div>
      </div>
      {selectedLend != -1 &&
        <div className={`fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center bg-[#00000030] backdrop-blur-md p-[20px] z-10`}>
          <div
            className="fixed inset-0 transition-opacity"
            onClick={() => { if (!revokePending) setSelectedLend(-1) }}
          />
          <div className="min-w-[300px] bg-[#D9D9D930] backdrop-blur-sm flex gap-[20px] flex-col rounded-[10px] p-[10px]" >
            <img className="w-full h-[125px] object-center" src={LendDlgBanner} alt="LendDlgBanner" />
            <div className="w-full flex flex-col gap-[10px] items-center">
              <img className="w-[65px] h-[65px] object-contain rounded-full -mt-[53px]" src={collections.find((collection) => collection.address == loans.loans[selectedLend].nftAddress).avatar} alt="avatar" />
              <span className="text-[14px] font-[400] text-white">{collections.find((collection) => collection.address == loans.loans[selectedLend].nftAddress).name}</span>
            </div>
            <div className="w-full flex gap-[20px] justify-between">
              <div className="flex flex-col items-center">
                <span className="text-[6px] font-[400] text-white">APY</span>
                <span className="text-[14px] font-[400] text-[#DBFF00]">{collections.find((collection) => collection.address == loans.loans[selectedLend].nftAddress).interest}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[6px] font-[400] text-white">DURATION</span>
                <span className="text-[14px] font-[400] text-white">{(collections.find((collection) => collection.address == loans.loans[selectedLend].nftAddress).duration / 86400).toFixed(2)}d</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[6px] font-[400] text-white">FLOOR</span>
                <span className="text-[14px] font-[400] text-white">{formatUnits(loans.loans[selectedLend].amount, 18)}</span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-[10px]">
              <span className="text-[16px] font-bold text-white">Status</span>
              <span className="text-[20px] font-bold text-white">Seeking Borrower</span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span className="text-[16px] font-bold text-white">Offer Amount</span>
              <div className="flex flex-col items-center">
                <span className="text-[20px] font-bold text-white">Ŀ {formatUnits(loans.loans[selectedLend].amount, 18)}</span>
                {/* <span className="text-[12px] text-white">{loans.lends[selectedLend].interest}%</span> */}
              </div>
            </div>
            <div className="w-full flex justify-center">
              <button disabled={revokePending} onClick={(e) => { revokeOffer() }} className="bg-gradient-to-r from-[#159F2C] text-black px-6 py-2 max-sm:text-[11px] max-sm:px-4 rounded-lg to-[#DBFF00]">
                REVOKE {revokePending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Offers;
