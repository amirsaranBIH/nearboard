import React, { useContext } from 'react';

import { Link } from 'react-router-dom';

import arrowUpIcon from "../../../assets/icons/arrowup.svg"
import arrowUpWhiteIcon from "../../../assets/icons/arrowup-white.svg"
import NearboardContext from '../../../store/NearboardContext';
import MoreOptions from '../MoreOptions/MoreOptions';

import './Question.css';
import { toast } from 'react-toastify';

export default function Question({ event, question, options }) {
  const nearboardContext = useContext(NearboardContext);
  function vote() {
    nearboardContext.contract.vote(question.id).then(() => {
      toast.success("Successfully voted");
      console.log(res);
    });
  }

  function unvote() {
    nearboardContext.contract.unvote(question.id).then(() => {
      toast.success("Successfully unvoted");
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
          </div>
        </div>
        {(options && nearboardContext.wallet.accountId === question.asker) && <MoreOptions options={options} />}
      </div>
    </div>
  );
}
