import React, { useContext, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import arrowUpIcon from "../../../assets/icons/arrowup.svg"
import arrowUpWhiteIcon from "../../../assets/icons/arrowup-white.svg"
import NearboardContext from '../../../store/NearboardContext';
import MoreOptions from '../MoreOptions/MoreOptions';
import { providers, utils } from "near-api-js";

import './Question.css';
import { toast } from 'react-toastify';

export default function Question({ event, question, options, onVote, onUnvote }) {
  const nearboardContext = useContext(NearboardContext);

  const [nearRepresented, setNearRepresented] = useState(0);

  useEffect(() => {
    calculateNearRepresented();
  }, []);

  async function calculateNearRepresented() {
    const provider = new providers.JsonRpcProvider({
      url: "https://rpc.testnet.near.org",
    });

    const accountBalanceCache = JSON.parse(localStorage.getItem("nearboard_account_balance_cache")) || {};

    for (let i = 0; i < question.votes.length; i++) {
      if (!accountBalanceCache[question.votes[i]]) {
        try {
          const account = await provider.query({
            request_type: "view_account",
            finality: "final",
            account_id: question.votes[i],
          });
          accountBalanceCache[question.votes[i]] = account.amount;
        } catch(err) {
          console.log(err);
        }
      }
      const newNearAmount = Number(utils.format.formatNearAmount(accountBalanceCache[question.votes[i]])) + Number(nearRepresented);
      setNearRepresented(newNearAmount.toFixed());
    }

    localStorage.setItem("nearboard_account_balance_cache", JSON.stringify(accountBalanceCache))
  }

  function vote() {
    if (!nearboardContext.isSignedIn) {
      toast.error("Not signed in");
      nearboardContext.wallet.signIn();
      return;
    }

    nearboardContext.contract.vote(question.id).then(() => {
      if (!nearboardContext.isSignedIn) {
        toast.error("Not signed in");
        nearboardContext.wallet.signIn();
        return;
      }

      toast.success("Successfully voted");
      onVote(question);
    });
  }

  function unvote() {
    nearboardContext.contract.unvote(question.id).then(() => {
      toast.success("Successfully unvoted");
      onUnvote(question);
    });
  }

  return (
    <div className="question">
      <div className="question-text">{question.question}</div>
      <hr />
      <div className="question-info">
        <div>asks {question.asker} - for <Link className="link" to={"/event/" + event.id}>{event.name}</Link></div>
        <div className="question-vote">
            { question.votes.some(vote => vote === nearboardContext.wallet.accountId) ? 
              <div className="question-vote-btn voted" onClick={unvote}>
                <img src={arrowUpWhiteIcon} alt="arrow up icon" />
              </div> : 
              <div className="question-vote-btn" onClick={vote}>
                <img src={arrowUpIcon} alt="arrow up icon" />
              </div>
            }
          <div className="question-vote-info">
            <span className="question-vote-number">{question.votes.length} {question.votes.length > 1 ? "Votes" : "Vote"}</span>
            <span className="question-vote-near-represented">{nearRepresented} NEAR represented</span>
          </div>
        </div>
      </div>
        {(options && nearboardContext.wallet.accountId === question.asker) && <MoreOptions options={options} />}
    </div>
  );
}
