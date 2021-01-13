import React, {Component} from "react";
import "./scss/zapier_info.scss";
import zap1 from "./pictures/zaplogin.png";
import zap2 from "./pictures/zaprole.png";
import zap3 from "./pictures/zapselectapp.png";
import zap4 from "./pictures/zapsync.png";
import zap5 from "./pictures/zapzap.png";
import zap6 from "./pictures/zappresetup.png";
import zap7 from "./pictures/zapmidsetup.png";
import zap8 from "./pictures/zapsetup.png";
import zap9 from "./pictures/zapapicall.png";
import zap10 from "./pictures/zapstep2.png";
import zap11 from "./pictures/zapstep3.png";
import zap12 from "./pictures/zapstep4.png";
import zap13 from "./pictures/zapstep5.png";
import zap14 from "./pictures/zapstep6.png";
import zap15 from "./pictures/zapprestep7.png";
import zap16 from "./pictures/zapstep7.png";
import zap17 from "./pictures/zapstep8.png";
import {AffordableClient} from "affordable-client";

const rawGist1 = `
<div id="gist99834345" class="gist"> <div class="gist-file"> <div class="gist-data"> <div class="js-gist-file-update-container js-task-list-container file-box"> <div id="file-affordable_demo-js" class="file"> <div itemprop="text" class="Box-body p-0 blob-wrapper data type-javascript "> <table class="highlight tab-size js-file-line-container" data-tab-size="8"> <tr> <td id="file-affordable_demo-js-L1" class="blob-num js-line-number" data-line-number="1"></td> <td id="file-affordable_demo-js-LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-k">const</span> <span class="pl-c1">https</span> <span class="pl-k">=</span> <span class="pl-c1">require</span>(<span class="pl-s"><span class="pl-pds">&#39;</span>https<span class="pl-pds">&#39;</span></span>);</td> </tr> <tr> <td id="file-affordable_demo-js-L2" class="blob-num js-line-number" data-line-number="2"></td> <td id="file-affordable_demo-js-LC2" class="blob-code blob-code-inner js-file-line"><span class="pl-k">const</span> <span class="pl-c1">request</span> <span class="pl-k">=</span> <span class="pl-c1">require</span>(<span class="pl-s"><span class="pl-pds">&#39;</span>request<span class="pl-pds">&#39;</span></span>);</td> </tr> <tr> <td id="file-affordable_demo-js-L3" class="blob-num js-line-number" data-line-number="3"></td> <td id="file-affordable_demo-js-LC3" class="blob-code blob-code-inner js-file-line"> </td> </tr> <tr> <td id="file-affordable_demo-js-L4" class="blob-num js-line-number" data-line-number="4"></td> <td id="file-affordable_demo-js-LC4" class="blob-code blob-code-inner js-file-line"><span class="pl-c"><span class="pl-c">//</span> Make the request to affordable&#39;s sever</span></td> </tr> <tr> <td id="file-affordable_demo-js-L5" class="blob-num js-line-number" data-line-number="5"></td> <td id="file-affordable_demo-js-LC5" class="blob-code blob-code-inner js-file-line"><span class="pl-en">request</span>(</td> </tr> <tr> <td id="file-affordable_demo-js-L6" class="blob-num js-line-number" data-line-number="6"></td> <td id="file-affordable_demo-js-LC6" class="blob-code blob-code-inner js-file-line"> {</td> </tr> <tr> <td id="file-affordable_demo-js-L7" class="blob-num js-line-number" data-line-number="7"></td> <td id="file-affordable_demo-js-LC7" class="blob-code blob-code-inner js-file-line"> headers<span class="pl-k">:</span> {</td> </tr> <tr> <td id="file-affordable_demo-js-L8" class="blob-num js-line-number" data-line-number="8"></td> <td id="file-affordable_demo-js-LC8" class="blob-code blob-code-inner js-file-line"> <span class="pl-s"><span class="pl-pds">&#39;</span>authorization<span class="pl-pds">&#39;</span></span><span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">&#39;</span>Bearer YOUR_API_KEY<span class="pl-pds">&#39;</span></span></td> </tr> <tr> <td id="file-affordable_demo-js-L9" class="blob-num js-line-number" data-line-number="9"></td> <td id="file-affordable_demo-js-LC9" class="blob-code blob-code-inner js-file-line"> },</td> </tr> <tr> <td id="file-affordable_demo-js-L10" class="blob-num js-line-number" data-line-number="10"></td> <td id="file-affordable_demo-js-LC10" class="blob-code blob-code-inner js-file-line"> url<span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">&#39;</span>api.affordable.com<span class="pl-pds">&#39;</span></span>,</td> </tr> <tr> <td id="file-affordable_demo-js-L11" class="blob-num js-line-number" data-line-number="11"></td> <td id="file-affordable_demo-js-LC11" class="blob-code blob-code-inner js-file-line"> method<span class="pl-k">:</span> <span class="pl-s"><span class="pl-pds">&#39;</span>GET<span class="pl-pds">&#39;</span></span></td> </tr> <tr> <td id="file-affordable_demo-js-L12" class="blob-num js-line-number" data-line-number="12"></td> <td id="file-affordable_demo-js-LC12" class="blob-code blob-code-inner js-file-line"> },</td> </tr> <tr> <td id="file-affordable_demo-js-L13" class="blob-num js-line-number" data-line-number="13"></td> <td id="file-affordable_demo-js-LC13" class="blob-code blob-code-inner js-file-line"> (<span class="pl-smi">err</span>, <span class="pl-smi">res</span>, <span class="pl-smi">body</span>) <span class="pl-k">=&gt;</span> {</td> </tr> <tr> <td id="file-affordable_demo-js-L14" class="blob-num js-line-number" data-line-number="14"></td> <td id="file-affordable_demo-js-LC14" class="blob-code blob-code-inner js-file-line"> <span class="pl-c"><span class="pl-c">//</span> Make sure the request was successful</span></td> </tr> <tr> <td id="file-affordable_demo-js-L15" class="blob-num js-line-number" data-line-number="15"></td> <td id="file-affordable_demo-js-LC15" class="blob-code blob-code-inner js-file-line"> <span class="pl-k">if</span>(<span class="pl-smi">res</span>.<span class="pl-smi">statusCode</span> <span class="pl-k">==</span> <span class="pl-c1">200</span>) {</td> </tr> <tr> <td id="file-affordable_demo-js-L16" class="blob-num js-line-number" data-line-number="16"></td> <td id="file-affordable_demo-js-LC16" class="blob-code blob-code-inner js-file-line"> <span class="pl-k">let</span> applicationsArr <span class="pl-k">=</span> <span class="pl-c1">JSON</span>.<span class="pl-c1">parse</span>(body);</td> </tr> <tr> <td id="file-affordable_demo-js-L17" class="blob-num js-line-number" data-line-number="17"></td> <td id="file-affordable_demo-js-LC17" class="blob-code blob-code-inner js-file-line"> </td> </tr> <tr> <td id="file-affordable_demo-js-L18" class="blob-num js-line-number" data-line-number="18"></td> <td id="file-affordable_demo-js-LC18" class="blob-code blob-code-inner js-file-line"> <span class="pl-c"><span class="pl-c">//</span> Loop through applications</span></td> </tr> <tr> <td id="file-affordable_demo-js-L19" class="blob-num js-line-number" data-line-number="19"></td> <td id="file-affordable_demo-js-LC19" class="blob-code blob-code-inner js-file-line"> <span class="pl-smi">applicationsArr</span>.<span class="pl-c1">forEach</span>((<span class="pl-smi">application</span>) <span class="pl-k">=&gt;</span> {</td> </tr> <tr> <td id="file-affordable_demo-js-L20" class="blob-num js-line-number" data-line-number="20"></td> <td id="file-affordable_demo-js-LC20" class="blob-code blob-code-inner js-file-line"> <span class="pl-c"><span class="pl-c">//</span> Process application here...</span></td> </tr> <tr> <td id="file-affordable_demo-js-L21" class="blob-num js-line-number" data-line-number="21"></td> <td id="file-affordable_demo-js-LC21" class="blob-code blob-code-inner js-file-line"> <span class="pl-en">console</span>.<span class="pl-c1">log</span>(application);</td> </tr> <tr> <td id="file-affordable_demo-js-L22" class="blob-num js-line-number" data-line-number="22"></td> <td id="file-affordable_demo-js-LC22" class="blob-code blob-code-inner js-file-line"> });</td> </tr> <tr> <td id="file-affordable_demo-js-L23" class="blob-num js-line-number" data-line-number="23"></td> <td id="file-affordable_demo-js-LC23" class="blob-code blob-code-inner js-file-line"> </td> </tr> <tr> <td id="file-affordable_demo-js-L24" class="blob-num js-line-number" data-line-number="24"></td> <td id="file-affordable_demo-js-LC24" class="blob-code blob-code-inner js-file-line"> } <span class="pl-k">else</span> {</td> </tr> <tr> <td id="file-affordable_demo-js-L25" class="blob-num js-line-number" data-line-number="25"></td> <td id="file-affordable_demo-js-LC25" class="blob-code blob-code-inner js-file-line"> <span class="pl-c"><span class="pl-c">//</span> Perform error handling here</span></td> </tr> <tr> <td id="file-affordable_demo-js-L26" class="blob-num js-line-number" data-line-number="26"></td> <td id="file-affordable_demo-js-LC26" class="blob-code blob-code-inner js-file-line"> <span class="pl-en">console</span>.<span class="pl-c1">log</span>(<span class="pl-s"><span class="pl-pds">&quot;</span>Unable to fetch applications<span class="pl-pds">&quot;</span></span>);</td> </tr> <tr> <td id="file-affordable_demo-js-L27" class="blob-num js-line-number" data-line-number="27"></td> <td id="file-affordable_demo-js-LC27" class="blob-code blob-code-inner js-file-line"> }</td> </tr> <tr> <td id="file-affordable_demo-js-L28" class="blob-num js-line-number" data-line-number="28"></td> <td id="file-affordable_demo-js-LC28" class="blob-code blob-code-inner js-file-line"> }</td> </tr> <tr> <td id="file-affordable_demo-js-L29" class="blob-num js-line-number" data-line-number="29"></td> <td id="file-affordable_demo-js-LC29" class="blob-code blob-code-inner js-file-line">);</td> </tr> </table> </div> </div> </div> </div> <div class="gist-meta"> <a href="https://gist.github.com/zack-w/047ba1b58f02044f0ad90db17c1662d2/raw/aab865fb9ebb689a20df5057d974ae6b5b435cc5/affordable_demo.js" style="float:right">view raw</a> <a href="https://gist.github.com/zack-w/047ba1b58f02044f0ad90db17c1662d2#file-affordable_demo-js">affordable_demo.js</a> hosted with &#10084; by <a href="https://github.com">GitHub</a> </div> </div> </div> 
`;

const exampleOutput = [
  {
    id: 10,
    BirthDate: "2015-01-17T05:00:00.000Z",
    CaregiverName: "Bill",
    CaregiverRelationship: "testRelationship",
    CaregiverEmployer: "testEmployer",
    userID: 10,
    deductibleAmt: "100",
    copay: "101",
    companyName: "Ether",
    GroupNumber: "1001",
    HasDeductibles: 0,
    currentlyEmployed: 1,
    additionalIncome: 0,
    grossIncome: "50000",
    receiveSocialSecurity: 0,
    explainAssistance: "None",
    numPplHousehold: 1,
    SSN: "111-11-1111",
    BirthCountry: "USA",
    Citizenship: "USA",
    AlienNumber: "None",
    Birthplace: 0,
    SSN2: "None",
    Provider: "Self",
    insuranceCarrier: "Aetna",
    planType: "1",
    policyIdNumber: "2",
    policyHolder: "testHolder",
    hasEmployerInsurance: 1,
    OtherCarrier: "testOther",
    OtherHolder: "testOtherHolder",
    Marriage: 0,
    Children: 0,
    NumChildren: "0",
    PrimaryPhone: 111111111,
    SecondaryPhone: 222222222,
    TertiaryPhone: 2147483647,
    PreferredLang: "English",
    OtherLang: "None",
    Sex: "M",
    Ethnicity: "Caucasian",
    OtherEthnicity: "None"
  }
];

//function to retrieve the organization id and key
function ApiCredentials(orgId, apiKey) {
  return (
    <div className="endpoint">
      <div style={{ fontWeight: 900, fontSize: 22 }}>Your API Credentials</div>

      <div style={{ marginTop: 20 }}>
        <strong>Organization ID:</strong>

        <span
          style={{
            fontFamily: "'Courier', monospace",
            backgroundColor: "#EEE",
            padding: "0px 6px",
            marginLeft: 10
          }}
        >
          {orgId}
        </span>

        <br />

        <strong>API Key:</strong>

        <span
          style={{
            fontFamily: "'Courier', monospace",
            backgroundColor: "#EEE",
            padding: "0px 6px",
            marginLeft: 10
          }}
        >
          {apiKey}
        </span>
      </div>
    </div>
  );
}

interface ZapierProps {
  orgId?: number | null;
  client: AffordableClient;
}

interface ZapierState {
  solution: string | null;
  apiKey: string;
}

//main component for the page.
class Zapier extends Component<ZapierProps, ZapierState> {
  constructor(props) {
    super(props);

    this.state = {
      solution: null,
      apiKey: ""
    };
  }

  componentDidMount() {
    if (this.props.orgId) {
      this.props.client.getApiKey(this.props.orgId).then(apiKey => {
        this.setState({ apiKey });
      });
    }
  }

  render() {
    return (
      <div style={{ padding: "40px", overflowY: "scroll" }}>
        <h1 style={{ fontWeight: 800 }}>Integrate</h1>

        <div className="infoPanel">
          <div>INFORMATION</div>

          <p>
            In addition to viewing applications submitted to your application in
            your dashboard, you can integrate using our API directly into your
            workflow. We offer two modes of integration: (1) an API for
            organizations with software engineers, and (2) Zapier, a solution
            for non-technical organizations.
          </p>
        </div>

        <div style={{ marginTop: 30, marginBottom: 30 }}>
          <div className="integrateHeader">
            How would you like to integrate?
          </div>

          <div className="row">
            <div className="col-md-4 offset-md-2">
              <div
                className="integrateCard"
                onClick={() => this.setState({ solution: "api" })}
              >
                <h2>API</h2>

                <p>
                  Our API solution is perfect for organizations that have
                  software engineers. It can integrate directly into your
                  existing software.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="integrateCard"
                onClick={() => this.setState({ solution: "zapier" })}
              >
                <h2>Zapier</h2>

                <p>
                  This solution is great for non-technical teams who wish to
                  integrate AFFORDABLE into their workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {this.state.solution == "api" && (
          <div className="integrateAPI">
            {ApiCredentials(this.props.orgId, this.state.apiKey)}

            <div className="endpoint">
              <h2>Authentication</h2>

              <p style={{ marginTop: 20 }}>
                All endpoints are secured through your unique organization API
                key, provided above. Currently, we only support key based bearer
                authentication. To properly authenticate, set your headers as
                such:
              </p>

              <div>
                <div className="inlineCode">Authentication</div> :
                <div className="inlineCode" style={{ marginLeft: 10 }}>
                  Bearer: API_KEY
                </div>
              </div>
            </div>

            <div className="endpoint">
              <h2>Fetch Applications</h2>

              <div className="inlineCode">GET /api/applications/:orgId</div>

              <p style={{ marginTop: 20 }}>
                <strong>Description:&nbsp;</strong>
                This endpoint allows you to fetch applications submitted to your
                organization through the AFFORDABLE system. You can call this
                endpoint regularly through a CRON job, or trigger a fetch of
                applications through a button press.
              </p>

              <strong>Sample Javascript Code:</strong>
              <br />
              <br />

              <div dangerouslySetInnerHTML={{ __html: rawGist1 }}></div>

              <strong>Sample Result:</strong>
              <br />
              <br />

              <pre>
                [<br />
                &nbsp; {"{"}
                <br />
                &nbsp; "id": 10,
                <br />
                &nbsp; "BirthDate": "2015-01-17T05:00:00.000Z",
                <br />
                &nbsp; "CaregiverName": "Bill",
                <br />
                &nbsp; "CaregiverRelationship": "testRelationship",
                <br />
                &nbsp; "CaregiverEmployer": "testEmployer",
                <br />
                &nbsp; "userID": 10,
                <br />
                &nbsp; "deductibleAmt": "100",
                <br />
                &nbsp; "copay": "101",
                <br />
                &nbsp; "companyName": "Ether",
                <br />
                &nbsp; "GroupNumber": "1001",
                <br />
                &nbsp; "HasDeductibles": 0,
                <br />
                &nbsp; "currentlyEmployed": 1,
                <br />
                &nbsp; "additionalIncome": 0,
                <br />
                &nbsp; "grossIncome": "50000",
                <br />
                &nbsp; "receiveSocialSecurity": 0,
                <br />
                &nbsp; "explainAssistance": "None",
                <br />
                &nbsp; "numPplHousehold": 1,
                <br />
                &nbsp; "SSN": "111-11-1111",
                <br />
                &nbsp; "BirthCountry": "USA",
                <br />
                &nbsp; "Citizenship": "USA",
                <br />
                &nbsp; "AlienNumber": "None",
                <br />
                &nbsp; "Birthplace": 0,
                <br />
                &nbsp; "SSN2": "None",
                <br />
                &nbsp; "Provider": "Self",
                <br />
                &nbsp; "insuranceCarrier": "Aetna",
                <br />
                &nbsp; "planType": "1",
                <br />
                &nbsp; "policyIdNumber": "2",
                <br />
                &nbsp; "policyHolder": "testHolder",
                <br />
                &nbsp; "hasEmployerInsurance": 1,
                <br />
                &nbsp; "OtherCarrier": "testOther",
                <br />
                &nbsp; "OtherHolder": "testOtherHolder",
                <br />
                &nbsp; "Marriage": 0,
                <br />
                &nbsp; "Children": 0,
                <br />
                &nbsp; "NumChildren": "0",
                <br />
                &nbsp; "PrimaryPhone": 111111111,
                <br />
                &nbsp; "SecondaryPhone": 222222222,
                <br />
                &nbsp; "TertiaryPhone": 2147483647,
                <br />
                &nbsp; "PreferredLang": "English",
                <br />
                &nbsp; "OtherLang": "None",
                <br />
                &nbsp; "Sex": "M",
                <br />
                &nbsp; "Ethnicity": "Caucasian",
                <br />
                &nbsp; "OtherEthnicity": "None"
                <br />
                &nbsp; {'}'}<br />]
              </pre>
            </div>

            <div className="endpoint">
              <h2>Get Custom Questions</h2>

              <div className="inlineCode">
                GET /api/organiation/:orgId/questions
              </div>

              <p style={{ marginTop: 20 }}>
                <strong>Description:&nbsp;</strong>
                This endpoint will give you all custom questions associated with
                your organization.
              </p>
            </div>
          </div>
        )}

        {this.state.solution == "zapier" && (
          <div className="zapier__container">
            {ApiCredentials(this.props.orgId, this.state.apiKey)}
            <div
              className="zapier__container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div className="integrateHeader">Integrating Using Zapier</div>
            </div>
            <div className="zapier__container">
              <p>
                Below is a link to the Zapier software that will help you access
                the information of our users. Zapier, simply described for the
                purposes of what we will be using it for, is a a successful
                software that will take the information stored in or databases
                and send them to in in forms you are most fimiliar with like MS
                Excel, Email, Google Docs etc. This webpage will help new users
                to Zapier get started!
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{
                    borderRadius: 6,
                    margin: 10,
                    display: "flex",
                    justifyContent: "center"
                  }}
                  src={zap1}
                  alt="zaplogin"
                  className="zapier__image"
                />
              </div>
              <p>
                Once you click the link below you will be taken to the zapier
                login page as shown above. Here you can create an account and
                sign up using a company email and a workers first and last name.
                Then you will be taken to another page where you will put in the
                password. Once youve done this you will be given a professional
                14 day free trial for their professional mode. For our purposes
                you can use Zapier without having to upgade to the professional
                account.
              </p>
              <div className="zapier__container">
                <a
                  href="https://zapier.com/?utm_source=bing&utm_medium=cpc&utm_campaign=bing-usa-nua-search-all-brand_exact&utm_term=zapier&utm_content=BdrvKZIk_pcrid_{creative}_pkw_zapier_pmt_e_pdv_c_slid__pgrid_1326011811599708_ptaid_kwd-82875951057857:loc-190_"
                  className="zapier_info-link"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  Zapier Website
                </a>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap2}
                  alt="zaprole"
                  className="zapier__image"
                />
              </div>
              <p>
                After you've successfully done that you will be askesd to state
                your role. Now this is not important and can be skipped.
                However, if you so desire you can choose a role. It doesnt have
                a major effect on how the software will work or what you can do
                on it.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap3}
                  alt="zapselectapp"
                  className="zapier__image"
                />
              </div>
              <p>
                After you have choosen a role or skipped you will be asked to
                choose the kind of softwares that you would like the information
                you get to be sent to. In there you will see ones you know and
                love sucha as Google DOC, MS Excel, Google Sheets etc. Feel free
                to pick as many as you think you will need. We also suggest that
                you use the ones we've mentioned above.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap4}
                  alt="zapsync"
                  className="zapier__image"
                />
              </div>
              <p>
                At this point youre almost there! You are now in your dashboard
                and will be asked whether you would want to use some predefined
                sync options. These sync options will be allow you to move
                information from one software to another. For example when you
                get the information from affordable and have it sent to a google
                Excel sheet you could also sync so that the information will be
                move from the Excel sheet to Google Docs. Note this is optional
                but can be explored if you desire to do so!
              </p>
              <h2>Connecting With Affordable</h2>
              <p>
                Now you are all set! the next step is to set up your "ZAP" so
                you can recieve the information through the api calls (i.e
                request to get affordable information). To do this you will
                click on the orange "Make a Zap" button on the top right corner.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap5}
                  alt="zapzap"
                  className="zapier__image"
                />
              </div>
              <p>
                On this page you will search affordable in the search bar
                provided. You can also give this zap a name for easy
                identifcation by typing in a name for the zap on top left hand
                corner of your screen.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap6}
                  alt="zappresetup"
                  className="zapier__image"
                />
              </div>
              <p>
                Once you've clicked on the affordable icon you can choose the
                trigger. The purpose of the trigger is to tell Zapier when to
                get information form Affordable. Think of it as a timer that
                you've set for when you want new information to be sent to you.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap7}
                  alt="zapmidsetup"
                  className="zapier__image"
                />
              </div>
              <p>
                Now that youve done this the next step is to choose the account
                as shown below.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap8}
                  alt="zapsetup"
                  className="zapier__image"
                />
              </div>
              <p>
                Once you have done this you will be directed to another page
                where you will put in the API KEY and ORGANIZATIONAL ID that we
                have provided for you "Alone". This is what we will use to
                verfiy that you are the one asking for the information and that
                we can trust you to to give it to you.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={zap9} alt="zapapicall" className="zapier__image" />
              </div>
              <p>
                Once you have done this you can decide to test your zap to see
                if it works. It's optional but we hope you do so that you can be
                sure that you're all set. The next three images shows you what
                happens when you test your zap and how it will show you your
                results if your setup was successful.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap15}
                  alt="zapprestep7"
                  className="zapier__image"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap16}
                  alt="zapstep7"
                  className="zapier__image"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap17}
                  alt="zapstep8"
                  className="zapier__image"
                />
              </div>
              <p>
                Once you have done this you have now successfully connected to
                Affordable. You will be taken back to this page below where you
                can choose how and where you want the information you get from
                affordable to be stored.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap10}
                  alt="zapstep2"
                  className="zapier__image"
                />
              </div>
              <p>
                Our examples will be set up for if you use MS Excel. We would
                suggest you use MS Excel or Google Sheets since they best
                resemble database structures. However it is left for you to
                choose how you want your info to be stored.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap11}
                  alt="zapstep3"
                  className="zapier__image"
                />
              </div>
              <p>
                The next three images below just show how you can pick what kind
                of data is sent to you and how you want that piece pf data top
                be named if your records have named it something different. The
                Affordable database has a lot of info on these patients. This
                will help you filter the kind of information you want.
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap12}
                  alt="zapstep4"
                  className="zapier__image"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap13}
                  alt="zapstep5"
                  className="zapier__image"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  style={{ borderRadius: 6, margin: 10 }}
                  src={zap14}
                  alt="zapstep6"
                  className="zapier__image"
                />
              </div>
              <p>
                Once you've done this you can access your zap on your dashboard.
                There you can see all the zaps you've created. For more
                information on Zapier you can find a tips and advice button on
                the top of your screen of you dashboard. There you can see
                videos more clips on the power of Zapier.
              </p>
              <h3>At this point you are all set, Welcome to Affordabale!</h3>
            </div>
          </div>
        )}
      </div>
    );
  }
}
//code to render the component on the page
export default Zapier;
