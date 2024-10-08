import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import GradientButton from "../../components/GradientButton";
import Editor from "@monaco-editor/react";
import { GrDeploy } from "react-icons/gr";
import { FaMagic } from "react-icons/fa";
import { LuHardHat } from "react-icons/lu";
import LightButton from "../../components/LightButton";
import YellowButton from "../../components/YellowButton";
import { FaCode, FaDownload } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { instance } from "../../config/axios";
import { encode } from "base-64";
import axios from "axios";
import { db } from "../../config/firebase";
import { AppContext } from "../../context/AppContext";
import { TestContext } from "../../context/TestContext";
import { doc, updateDoc } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import CustomizedDialogs from "../../components/LegacyDialog";
import { ethers6Adapter } from "thirdweb/adapters/ethers6";
import { useActiveAccount } from "thirdweb/react";
import { sepolia, polygonAmoy } from "thirdweb/chains";
import { client } from "../../components/Navbar";
// import { injectedProvider } from "thirdweb/wallets";


// import SuccessTick from "../../components/Lottie/SuccessTick";
// // import { useActiveAccount, useSigner } from "thirdweb/react";
import { ethers } from 'ethers';

// import { userInfo } from "os";

const tempSteps = [
  {
    id: "01",
    text: "Open Remix IDE",
  },
  {
    id: "02",
    text: 'Click "+" in the file explorer, name the file according to contract name(e.g., Contract.sol).',
  },
  {
    id: "03",
    text: "Copy contract code, paste into the new file.",
  },
  {
    id: "04",
    text: 'Go to "Solidity" tab, select compiler version, click "Compile".',
  },
  {
    id: "05",
    text: 'Switch to "Deploy & Run Transactions" tab, click "Deploy".',
  },
  {
    id: "06",
    text: "Find deployed contract, expand, interact with functions",
  },
  {
    id: "07",
    text: 'Deploy contract, set value using a setter function in "Deployed Contracts" with entered parameter',
  },
  {
    id: "08",
    text: "Get value using a getter function in 'Deployed Contracts'",
  },
  {
    id: "09",
    text: 'In "Events" section, observe emitted events.',
  },
  {
    id: "10",
    text: "If present, test modifiers like onlyOwner.",
  },
];

function EditorPage() {
  const { user } = useContext(AppContext);
  const { state } = useLocation();
  const [inputQuestions, setInputQuestions] = useState("");
  const [code, setCode] = useState("// your code goes here");
  const [summary, setSummary] = useState("Generate a code first");
  const [tabsLayout, setTabsLayout] = useState([25, 45, 30]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [contractName, setContractName] = useState("");
  const isTest = React.useContext(TestContext);
  const [ABI, setABI] = useState();
  const [byteCode, setByteCode] = useState();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractAdd, setContractAdd] = useState();
  const [currentStep, setCurrentStep] = useState(0);

  const handleDownloadHardhat = async () => {
    setCurrentStep(0);
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCurrentStep(1);
       await axios.post('http://localhost:3000/insert_code',{
          code: code,
          contractName: contractName,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));

      setCurrentStep(2);
      const data = await axios.post('http://localhost:3000/compile-code', {
        contractName: contractName,
      });
      // console.log(data)
      console.log(data?.data?.data?.abi)
      console.log(data?.data?.data?.bytecode)
      setABI(data?.data?.data?.abi)
      setByteCode(data?.data?.data?.bytecode)

      // console.log(ABI)
      // console.log(byteCode)
    
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(ABI)
  console.log(byteCode)
  setCurrentStep(3);
  const response1 = await axios.post('http://localhost:3000/download_hardhat', {
    responseType: 'blob' // Specify response type as 'blob' to handle binary data
  });
  console.log("download started")
  
  const url = window.URL.createObjectURL(new Blob([response1.data], { type: 'application/zip' }));

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hardhat_folder.zip';
  document.body.appendChild(link);
await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate a click on the link to trigger the download automatically
    link.click();
        
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
console.log("download completed")
 
setLoading(false);
} catch (error) {
  console.log(error);
}
  };

  const onTabClick = async () => {

    console.log(state?.selectedOption?.content)
    console.log(state?.selectedOption?.heading)
    console.log(inputQuestions)

    try {
      const response = await axios.post('http://localhost:3000/generate_code', {
        approach_heading: state?.selectedOption?.heading,
        approach_content: state?.selectedOption?.content,
        user_approach: inputQuestions,
      });

      // <SuccessTick/>

      console.log(response?.data?.generatedCode?.response?.contract_name);
      setContractName(response?.data?.generatedCode?.response?.contract_name);
      setCode(response?.data?.generatedCode?.response?.solidity_code);
      // setCode(response?.response.solidity_code);
      setSummary(response?.data?.generatedCode?.response?.details?.[0]?.additional_notes);
      // updateDoc(doc(db, "users", user.address), {
      //   snippet: {
      //     approach_heading: state?.selectedOption?.heading,
      //     approach_content: state?.selectedOption?.content,
      //     user_approach: inputQuestions,
      //     solidity_code: response?.solidity_code,
      //     details: response?.details?.additional_notes,
      //   },
      // });
      if (tabsLayout[0] === 25) {
        setTabsLayout([5, 65, 30]);
        setIsDisabled(false);
      } else if (tabsLayout[0] === 5) {
        setTabsLayout([25, 45, 30]);
        setIsDisabled(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const deployContract = async () => {
  //   try {
  //     const response = await axios.post(
  //         "https://magic-deploy.onrender.com/deploy-contract",
  //       {
  //         rpc: "https://rpc.public.zkevm-test.net",
  //         bytecode: ABI?.bytecode,
  //         abi: ABI?.abi,
  //         is_test: isTest,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("deploy", response?.data);
  //     setContractAdd(response?.data?.contractAddress);
  //     await updateDoc(doc(db, "users", user?.address), {
  //       contractAddress: response?.data?.contractAddress,
  //     });
  //     setIsModalOpen(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // const client = process.env.client_ID
  
  
// const client = "179874cf01f3ef6b1e707e5d2e07590e"
const chain = polygonAmoy
const account = useActiveAccount();
// const metamaskProvider = injectedProvider("io.metamask");

  const deployContract = async () => {
    console.log("getting acc")
// console.log(account.address)
    const signer = await ethers6Adapter.signer.toEthers({ client, chain, account });
    // const signer = metamaskProvider.getSigner();4
      // const signer = client.wallet.getSigner();

    console.log(signer)
    if (!signer) {
        alert('Please connect your wallet first.');
        return;
    }

    console.log("got acc, dep started")
    try {
        // const factory = new ethers.ContractFactory(ABI, byteCode, signer);
        // console.log('ethers version:', ethers.version);


        // console.log('Deploying contract...');
        // console.log('Initiating contract deployment...');
        // const deploymentPromise = factory.deploy();
        // console.log('Deployment promise created');
        // const contract = await deploymentPromise;

        // console.log('Waiting for contract to be mined...');
        // await contract.waitForDeployment();

        // console.log('Contract deployed at address:', contract.address);
        // setContractAdd(contract.address);
        // console.log(contractAdd)

        console.log('Creating contract factory...');
    const factory = new ethers.ContractFactory(ABI, byteCode, signer);

    console.log('Preparing deployment transaction...');
    const deployTransaction = factory.getDeployTransaction();
    console.log('Deploy transaction:', deployTransaction);
    console.log("API Key:", client.apiKey); // Assuming `client` holds your thirdweb provider

    console.log('Estimating gas...');
    const estimatedGas = await signer.estimateGas(deployTransaction);
    console.log('Estimated gas:', estimatedGas.toString());

    console.log('Sending deployment transaction...');
    const tx = await signer.sendTransaction(deployTransaction);
    console.log('Transaction sent:', tx.hash);

    console.log('Waiting for transaction confirmation...');
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    console.log('Contract deployed at:', receipt.contractAddress);

    setContractAdd(receipt.contractAddress);
        setIsModalOpen(true);

    } catch (error) {
        console.error('Error deploying contract:', error);
        alert('Error deploying contract. Check the console for details.');
    } 
};

 
// const deployContracts = async () => {
//   try {
//     // Deploy the contract
//     const address = await deployContract({
//       client,
//       chain,
//       byteCode, // Replace with your contract's bytecode
//       signer: client.wallet.getSigner(),
//       constructorAbi: {
//         inputs: [{ type: "uint256", name: "value" }],
//         type: "constructor",
//         constructorParams: [],

//       },
    
//     });

//   console.log(address);

// } catch(error){
//   console.log(error)
// }
// }



  useEffect(() => {
    localStorage.setItem("code", code);
    localStorage.setItem("contractName", contractName);
  }, [code, contractName]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.href = "/doc";
  };

  return (
    <>
      <Box
        sx={{
          height: "calc(100vh - 4rem)",
          width: "100vw",
          padding: "1rem",
          margin: "auto",
          display: "flex",
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(255, 255, 255, 0.20)",
            background: "linear-gradient(180deg, #2B243C 0%, #0B031E 100%)",
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "stretch",
            height: "100%",
            padding: "0.5rem",
          }}
        >
          <Box
            width={tabsLayout[0] + "%"}
            height="100%"
            display="flex"
            justifyContent="space-evenly"
            alignItems="stretch"
            flexDirection="column"
            sx={{
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                borderRadius: 1,
                border: "1px solid #EEEEF0",
                background: "rgba(255, 255, 255, 0.10)",
                p: 2,
                height: "100%",
                overflowY: "auto",
                '@media (max-width: 600px)': {
                  height: "150px", // Adjusted height for smaller screens
                }, // Add scroll in y-axis if content overflows
              }}
            >
              {tabsLayout[0] === 25 && (
                <>
                  <Typography fontSize={18} fontWeight="600">
                    Approach Selected
                  </Typography>
                  <Typography fontSize={13}>
                    {state?.selectedOption?.content}
                  </Typography>
                </>
              )}
            </Box>
            <Box
              sx={{
                mt: 1,
                borderRadius: 1,
                border: "1px solid #2E3C51",
                background: "rgba(255, 255, 255, 0.05)",
                height: "100%",
                p: 2,
              }}
            >
              {tabsLayout[0] === 25 && (
                <Box height="100%">
                  <Typography variant="body" fontWeight={600} align="center">
                    What features do you want your smart contract to implement?
                  </Typography>
                  <Box height="80%" mt={1}>
                    <TextField
                      placeholder="Enter here..."
                      fullWidth
                      multiline
                      minRows={9}
                      onChange={(e) => setInputQuestions(e.target.value)}
                      value={inputQuestions}
                      sx={{
                        height: "100%",
                        overflow: "auto",
                        background: "rgba(255, 255, 255, 0.10)",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
            {tabsLayout[0] === 25 ? (
              <Box mt={1}>
                <GradientButton
                  onClick={onTabClick}
                  text="Generate Code"
                  icon={<FaMagic />}
                  fullWidth
                  styles={{
                    borderRadius: 1,
                  }}
                />
              </Box>
            ) : (
              <Box mt={1}>
                <Button
                  onClick={onTabClick}
                  sx={{
                    borderRadius: 1,
                    background: `var(--brand-mix, conic-gradient(
                from 180deg at 50% 50%,
                #b52bba 4.666563235223293deg,
                #a12cbc 23.647727966308594deg,
                #8c2ebe 44.85525995492935deg,
                #792fbf 72.45651304721832deg,
                #6c30c0 82.50000178813934deg,
                #4b32c3 127.99007892608643deg,
                #5831c2 160.968976020813deg,
                #6330c1 178.45529437065125deg,
                #742fc0 189.47770357131958deg,
                #8d2dbe 202.95226335525513deg,
                #a62cbc 230.65982580184937deg,
                #b92aba 251.35178089141846deg,
                #d029b8 276.4414644241333deg,
                #ec27b6 306.45145654678345deg,
                #c729b9 331.67617321014404deg
              )
            )`,
                    boxShadow: "0px 0px 60px 0px rgba(236, 39, 182, 0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                    width: "100%",
                    height: "100%",
                    // add on hover
                  }}
                >
                  <MdArrowForwardIos color="#fff" />
                </Button>
              </Box>
            )}
          </Box>
          <Divider
            orientation="vertical"
            sx={{
              ml: 1,
              bgcolor: "white",
            }}
          />
          <Box
            width={tabsLayout[1] + "%"}
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="stretch"
            flexDirection="column"
            px={1}
            sx={{
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderRadius: 1,
                border: "1px solid #EEEEF0",
                background: "#1D172B",
                mb: 1,
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Editor
                height="100%"
                defaultLanguage="sol"
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-evenly"
              alignItems="stretch"
              sx={{
                gap: 1,
              }}
            >
              <YellowButton
                text={loading ? "Loading...." : "Download Hardhat"}
                fullWidth
                isDisabled={isDisabled}
                icon={<LuHardHat color="black" />}
                onClick={() => handleDownloadHardhat()}
                
              />
            </Box>
          </Box>
          <Box
            width={tabsLayout[2] + "%"}
            display="flex"
            justifyContent="center"
            alignItems="stretch"
            flexDirection="column"
            height="100%"
          >
            <Box
              sx={{
                borderRadius: 1,
                border: "1px solid #2E3C51",
                background: "rgba(255, 255, 255, 0.05)",
                height: "25rem",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                pt: 2,
              }}
            >
              <Typography fontSize={18} fontWeight="600" align="center">
                Steps to test it on RemixIDE
              </Typography>
              <Box
                px={2}
                py={5}
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="space-between"
              >
                <Stepper
                  activeStep={-1}
                  orientation="vertical"
                  sx={{
                    color: "white",
                    overflow: "auto",
                  }}
                >
                  {tempSteps.map(({ id, text }) => {
                    return (
                      <Step key={id}>
                        <StepLabel color="white">
                          <Box color="white">{text}</Box>
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <LightButton
                  component={Link}
                  to={`https://remix.ethereum.org/?#code=${encode(
                    code
                  )}&autoCompile=true`}
                  target="_blank"
                  text="Open in Remix IDE"
                  icon={<FaCode />}
                  fullWidth
                />
              </Box>
            </Box>
            <Box
              my={1}
              sx={{
                borderRadius: 1,
                border: "1px solid #EEEEF0",
                background: "rgba(255, 255, 255, 0.10)",
                p: 2,
                height: "calc(100% - 20rem)",
                overflow: "auto",
              }}
            >
              <Typography fontSize={18} fontWeight="600">
                Contract Summary
              </Typography>
              <Typography fontSize={13}>{summary}</Typography>
            </Box>
            <Modal
              open={isModalOpen}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              sx={{
                "& > .MuiBackdrop-root": {
                  backdropFilter: "blur(2px)",
                },
                "& > .MuiBox-root": {
                  bgcolor: "black", // Set the background color of the modal content
                  color: "white", // Set the text color if needed
                  boxShadow: "0px 0px 60px 0px rgba(236, 39, 182, 0.60)",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "white",
                  padding: "2rem",
                  textAlign: "center",
                }}
              >
                <Typography variant="h5" mb={2}>
                  Successfully deployed your contract!
                </Typography>
                <Typography variant="body2" mb={2}>
                  This is your contract address:
                </Typography>
                <Typography variant="body2" mb={2} fontWeight={600}>
                  {contractAdd}
                </Typography>
                <Button variant="contained" onClick={handleModalClose}>
                  Next
                </Button>
              </Box>
            </Modal>
            <GradientButton
              icon={<GrDeploy />}
              onClick={deployContract}
              text="Magic Deploy"
              fullWidth
              isDisabled={isDisabled}
              styles={{
                borderRadius: 1,
                height: "2.5rem",
              }}
            />
          </Box>
        </Box>
      </Box>
      <CustomizedDialogs
        steps={[
          "Testing the contract",
          "Inserting your contract",
          "Compiling Contract",
          "Zipping files",
        ]}
        text={"Downloading Hardhat"}
        setOpen={setLoading}
        open={loading}
        stepCount={currentStep}
      />
    </>
  );
}

export default EditorPage;
