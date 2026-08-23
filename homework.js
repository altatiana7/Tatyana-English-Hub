const tedShortAnswerStage={
  label:"TED Deep Check",
  title:"No-Options Comprehension",
  subtitle:"Answer in full sentences. No multiple choice, no prompts.",
  render:()=>`<div class="case-file"><div class="case-head"><span>VIDEO CHECK</span><strong>Fingerprint Evidence</strong></div><div class="case-prompts"><p><b>1.</b> What exactly did detectives find at the 1902 crime scene?</p><p><b>2.</b> How did the investigators eventually identify a suspect?</p><p><b>3.</b> What happened after they found a fingerprint match?</p><p><b>4.</b> Why are fingerprints useful as forensic evidence?</p><p><b>5.</b> Why should a fingerprint match not automatically be treated as unquestionable proof?</p><p><b>6.</b> If you were the defence lawyer, what other evidence would you want before accepting a guilty verdict?</p></div><button type="button" class="secondary-button" id="toggleVideoKey">Show teacher key</button><div id="videoKey" class="transcript hidden"><p><b>1.</b> A shard of broken glass with several bloody fingerprints.</p><p><b>2.</b> They searched police fingerprint records until they found a match.</p><p><b>3.</b> The matched man later confessed to the crime.</p><p><b>4–5.</b> Accept clear, accurate answers based on the video: fingerprints can link a person to a surface, but interpretation and comparison still need care and context.</p><p><b>6.</b> Open answer. Strong responses may ask for CCTV, witness evidence, DNA, timeline/alibi evidence or corroborating forensic evidence.</p></div></div>`
};

const tedHomeworkStage={
  label:"Homework",
  title:"Video Homework",
  subtitle:"A short law-focused assignment based on the TED-Ed video.",
  render:()=>`<div class="case-file"><div class="case-head"><span>HOMEWORK</span><strong>Fingerprint Evidence</strong></div><p><b>Watch the video again.</b> First without subtitles; use subtitles only if you need them on the second viewing.</p><div class="quiz-list"><article class="quiz-row"><p><b>A. Short answers</b></p><p>Answer questions 1–6 from the previous screen in full sentences. Do not copy the wording of the video.</p></article><article class="quiz-row"><p><b>B. Vocabulary in context</b></p><p>Write one short crime case (6–8 sentences) using at least <b>8</b> of these expressions correctly:</p><div class="target-strip">evidence · witness · suspect · confess · forensic evidence · reasonable doubt · plead not guilty · verdict · charge someone with · wrongfully convicted</div></article><article class="quiz-row"><p><b>C. Legal opinion — 80–100 words</b></p><p><i>“A fingerprint match should never be enough on its own to convict a person.”</i></p><p>Agree or disagree. Give at least <b>two reasons</b> and refer to the idea of <b>reasonable doubt</b>.</p></article><article class="quiz-row"><p><b>D. Past tenses challenge</b></p><p>Retell the 1902 case in <b>5 sentences</b>. Use Past Simple, Past Continuous and Past Perfect at least once.</p></article></div><button type="button" class="secondary-button" id="toggleHomeworkKey">Show teacher checklist</button><div id="homeworkKey" class="transcript hidden"><p><b>Short answers:</b> complete ideas, not one-word responses.</p><p><b>Vocabulary:</b> 8 target expressions used naturally and accurately.</p><p><b>Opinion:</b> 80–100 words, clear position, 2 reasons, “reasonable doubt” used meaningfully.</p><p><b>Past tenses:</b> at least one accurate example of Past Simple, Past Continuous and Past Perfect.</p><p><b>Quick score:</b> comprehension 6 + vocabulary 4 + opinion 4 + grammar 3 = <b>17 points</b>.</p></div></div>`
};

teacherStages.splice(8,0,tedShortAnswerStage,tedHomeworkStage);

const originalBindStageInteractions=bindStageInteractions;
bindStageInteractions=function(){
  originalBindStageInteractions();
  const videoKeyBtn=document.getElementById('toggleVideoKey');
  if(videoKeyBtn)videoKeyBtn.addEventListener('click',()=>{const key=document.getElementById('videoKey');key.classList.toggle('hidden');videoKeyBtn.textContent=key.classList.contains('hidden')?'Show teacher key':'Hide teacher key';});
  const hwKeyBtn=document.getElementById('toggleHomeworkKey');
  if(hwKeyBtn)hwKeyBtn.addEventListener('click',()=>{const key=document.getElementById('homeworkKey');key.classList.toggle('hidden');hwKeyBtn.textContent=key.classList.contains('hidden')?'Show teacher checklist':'Hide teacher checklist';});
};
