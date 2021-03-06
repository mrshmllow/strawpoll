import { NextSeo } from "next-seo"
import { Hr, Main } from "../components/Primitives"

const Privacy: React.FC = () => (
  <Main>
    <NextSeo
      title="Strawpoll.ink: Create free & easy polls"
      description="Strawpoll.ink's privacy policy"
    />

    <div className="flex flex-col gap-2 text-left">
      <h1 className="text-center text-2xl text-slate-900 dark:text-slate-200 sm:text-3xl">
        Privacy Policy
      </h1>

      <h2
        className="text-xl text-slate-900 dark:text-slate-200 sm:text-2xl"
        id="voting">
        Voting on a poll
      </h2>
      <p>
        We collect your IP when voting on a poll so that we can eliminate
        duplicate votes. All records are erased once the poll is expired or
        deleted. We also store a cookie on your device, to reduce server
        pressure. The creator of the poll cannot see who you are or your IP.
      </p>

      <h2
        className="text-xl text-slate-900 dark:text-slate-200 sm:text-2xl"
        id="creating-polls">
        Creating polls
      </h2>
      <p>We store no information about you when you create a poll.</p>

      <Hr />

      <h2
        className="text-xl text-slate-900 dark:text-slate-200 sm:text-2xl"
        id="hcaptcha">
        hCaptcha
      </h2>
      <p>{`We use the hCaptcha anti-bot service (hereinafter "hCaptcha") on our website. This service is provided by Intuition Machines, Inc., a Delaware US Corporation ("IMI"). hCaptcha is used to check whether the data entered on our website (such as on a login page or contact form) has been entered by a human or by an automated program. To do this, hCaptcha analyzes the behavior of the website or mobile app visitor based on various characteristics. This analysis starts automatically as soon as the website or mobile app visitor enters a part of the website or app with hCaptcha enabled. For the analysis, hCaptcha evaluates various information (e.g. IP address, how long the visitor has been on the website or app, or mouse movements made by the user). The data collected during the analysis will be forwarded to IMI. hCaptcha analysis in the "invisible mode" may take place completely in the background. Website or app visitors are not advised that such an analysis is taking place if the user is not shown a challenge. Data processing is based on Art. 6(1)(f) of the GDPR (DSGVO): the website or mobile app operator has a legitimate interest in protecting its site from abusive automated crawling and spam. IMI acts as a "data processor" acting on behalf of its customers as defined under the GDPR, and a "service provider" for the purposes of the California Consumer Privacy Act (CCPA). For more information about hCaptcha and IMI's privacy policy and terms of use, please visit the following links: https://www.hcaptcha.com/privacy and https://www.hcaptcha.com/terms.`}</p>
    </div>
  </Main>
)

export default Privacy
