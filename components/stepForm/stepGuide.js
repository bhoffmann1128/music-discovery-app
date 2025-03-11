export default function StepGuide({activeStep}){


    function StepItem({stepNum, activeStep}) {
        let classStr = '';    
        if(stepNum == activeStep){
            classStr = "active";
        }
        return <div className={classStr}>{stepNum}</div>
      }

    return (
        <div className="form-step-guide-container">
            <h2 className="text-xl text-center mt-6 mb-0">complete your profile to start uploading songs</h2>
            <div className="form-step-guide">
                <StepItem stepNum="1" activeStep={activeStep}></StepItem>
                <StepItem stepNum="2" activeStep={activeStep}></StepItem>
                <StepItem stepNum="3" activeStep={activeStep}></StepItem>
                <StepItem stepNum="4" activeStep={activeStep}></StepItem>
                <StepItem stepNum="5" activeStep={activeStep}></StepItem>
                <StepItem stepNum="6" activeStep={activeStep}></StepItem>
                {process.env.NEXT_PUBLIC_PREMIUM == "true" && (<StepItem stepNum="7" activeStep={activeStep}></StepItem>)}
            </div>
        </div>
    )
}