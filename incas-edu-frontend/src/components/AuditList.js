import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from "@material-ui/core/Button";
import {
    adminAgreeAgencyWithdraw, adminAgreeAppeal,
    adminAgreeUserRecharge,
    adminRejectAgencyWithdraw, adminRejectAppeal,
    adminRejectUserRecharge
} from "../fetch/requestAPI";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        textAlign: 'left',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

export function RechargeAuditList(props) {

    const data = props.data;
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState({});
    const [audit, setAudit] = React.useState({});

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    async function agreeRecharge(rechargeId, index) {

        let res = await adminAgreeUserRecharge(rechargeId);

        if (res === "已审核通过"){
            window.alert("已通过该充值");
            let temp = audit;
            temp[index] = 1;
            setAudit(temp);
            // 强制闭合标签，防止重复提交
            setExpanded(false);
        }
    }

    async function rejectRecharge(rechargeId, index) {

        // console.log(rechargeId);
        let res = await adminRejectUserRecharge(rechargeId);

        if (res === "已审核拒绝") {
            window.alert("已拒绝该充值");
            let temp = audit;
            temp[index] = 2;
            setAudit(temp);
            // 强制闭合标签，防止重复提交
            setExpanded(false);
        }
    }

    return (
        Array.isArray(data) && data.length !== 0 ?
            <div className={classes.root}>
                {
                    data.map((value, index) => {
                        let panel = "panel" + (index + 1);
                        return(
                            <ExpansionPanel expanded={expanded === panel} onChange={handleChange(panel)} key={index}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography className={classes.heading}>充值账户：{value.email}</Typography>
                                    <Typography className={classes.heading}>充值方式：{value.paymentMethod}</Typography>
                                    <Typography className={classes.heading}>充值金额：{value.rechargeAmount}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: "flex", alignItems: "center"}}>
                                    <Typography className={classes.secondaryHeading}>
                                        <span>
                                            流水号：{value.paymentId}
                                            <br/>
                                            交易时间：{new Date(value.createTime).toLocaleDateString() + " " + new Date(value.createTime).toLocaleTimeString()}
                                        </span>
                                    </Typography>
                                    {
                                        !audit[index] ?
                                        (
                                            <div style={{display: "flex", flexGrow: 1, justifyContent: "space-around"}}>
                                                <Button onClick={()=> agreeRecharge(value.paymentId, index)} variant="outlined" color="primary">agree</Button>
                                                <Button onClick={()=> rejectRecharge(value.paymentId, index)} variant="outlined" color="secondary">reject</Button>
                                            </div>
                                        ) : (
                                            <div style={{display: "flex", flexGrow: 1, justifyContent: "space-around"}}>
                                                <span style={{flexGrow: 1, textAlign:'center'}}>CHECKED</span>
                                                <span style={{flexGrow: 1, textAlign:'center'}}>STATE: {audit[index] === 1 ? "AGREE" : "REJECT"}</span>
                                            </div>
                                        )
                                    }

                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })
                }
            </div> : <Typography variant="subtitle2" color="textSecondary" align="center">暂没有待审核充值记录</Typography>
    );
}


export function WithdrawAuditList(props) {

    const data = props.data;
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState(false);
    const [audit, setAudit] = React.useState({});

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    async function agreeWithdraw(withdrawId, index) {
        console.log(withdrawId);
        let res = await adminAgreeAgencyWithdraw(withdrawId);
        if (res === "已审核通过"){
            window.alert("已通过该提现");
            let temp = audit;
            temp[index] = 1;
            setAudit(temp);
            // 强制闭合标签，防止重复提交
            setExpanded(false);
        }
    }

    async function rejectWithdraw(withdrawId, index) {
        console.log(withdrawId);
        let res = await adminRejectAgencyWithdraw(withdrawId);
        if (res === "已审核拒绝") {
            window.alert("已拒绝该提现");
            let temp = audit;
            temp[index] = 2;
            setAudit(temp);
            // 强制闭合标签，防止重复提交
            setExpanded(false);
        }
    }

    return (
        Array.isArray(data) && data.length !== 0 ?
            <div className={classes.root}>
                {
                    data.map((value, index) => {
                        let panel = "panel" + (index + 1);
                        return(
                            <ExpansionPanel expanded={expanded === panel} onChange={handleChange(panel)} key={index}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography className={classes.heading}>提现账户：{value.email}</Typography>
                                    <Typography className={classes.heading}>提现金额：{value.withdrawAmount}</Typography>
                                    <Typography className={classes.heading}>提现方式：{value.paymentMethod}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: "flex", alignItems: "center"}}>
                                    <Typography className={classes.secondaryHeading}>
                                        <span>
                                            流水号：{value.paymentId}
                                            <br/>
                                            交易时间：{new Date(value.createTime).toLocaleDateString() + " " + new Date(value.createTime).toLocaleTimeString()}
                                        </span>
                                    </Typography>
                                    {
                                        !audit[index] ?
                                        (
                                            <div style={{display: "flex", flexGrow: 1, justifyContent: "space-around"}}>
                                                <Button onClick={()=> agreeWithdraw(value.paymentId, index)} variant="outlined" color="primary">agree</Button>
                                                <Button onClick={()=> rejectWithdraw(value.paymentId, index)} variant="outlined" color="secondary">reject</Button>
                                            </div>
                                        ) : (
                                            <div style={{display: "flex", flexGrow: 1, justifyContent: "space-around"}}>
                                                <span style={{flexGrow: 1, textAlign:'center'}}>CHECKED</span>
                                                <span style={{flexGrow: 1, textAlign:'center'}}>STATE: {audit[index] === 1 ? "AGREE" : "REJECT"}</span>
                                            </div>
                                        )
                                    }
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })
                }
            </div> : <Typography variant="subtitle2" color="textSecondary" align="center">暂没有待审核提现记录</Typography>
    );
}


export function AppealAuditList(props) {

    const data = props.data;
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState(false);
    const [audit, setAudit] = React.useState({});

    // const handleChange = panel => (event, isExpanded) => {
    //     setExpanded(isExpanded ? panel : false);
    // };
    const handleChange = (panel, fileId, index) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        if (isExpanded){
            props.onClick(fileId, index, "unchecked")
        }
    };


    async function agreeAppeal(appealId, index) {
        console.log(appealId);
        let res = await adminAgreeAppeal(appealId);
        if (res){
            window.alert("已通过该申诉");
            let temp = audit;
            temp[index] = 1;
            setAudit(temp);
            // 强制闭合标签，防止重复提交
            setExpanded(false);
        }
    }

    async function rejectAppeal(appealId, index) {
        console.log(appealId);
        let res = await adminRejectAppeal(appealId);
        if (res) {
            window.alert("已拒绝该申诉");
            let temp = audit;
            temp[index] = 2;
            setAudit(temp);
            // 强制闭合标签，防止重复提交
            setExpanded(false);
        }
    }

    return (
        Array.isArray(data) && data.length !== 0 ?
            <div className={classes.root}>
                {
                    data.map((value, index) => {
                        let panel = "panel" + (index + 1);
                        return(
                            //<ExpansionPanel expanded={expanded === panel} onChange={handleChange(panel)} key={index}>
                            <ExpansionPanel expanded={expanded === panel} onChange={handleChange(panel, value.fileId, index)} key={index}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography className={classes.heading}>申诉用户：{value.agencyEmail}</Typography>
                                    <Typography className={classes.heading}>申诉资源ID：{value.fileId}</Typography>
                                    <Typography className={classes.heading}>申诉时间：{new Date(value.createTime).toLocaleDateString() + " " + new Date(value.createTime).toLocaleTimeString()}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{display: "flex", alignItems: "center"}}>
                                    <Typography className={classes.secondaryHeading}>
                                        <span>
                                            申诉ID：{value.id}
                                            <br/>
                                            申诉理由：{value.detail}
                                            <br/>
                                            水印信息：{value.watermark}
                                        </span>
                                    </Typography>
                                    {
                                        !audit[index] ?
                                            (
                                                <div style={{display: "flex", flexGrow: 1, justifyContent: "space-around"}}>
                                                    <Button onClick={()=> agreeAppeal(value.id, index)} variant="outlined" color="primary">agree</Button>
                                                    <Button onClick={()=> rejectAppeal(value.id, index)} variant="outlined" color="secondary">reject</Button>
                                                </div>
                                            ) : (
                                                <div style={{display: "flex", flexGrow: 1, justifyContent: "space-around"}}>
                                                    <span style={{flexGrow: 1, textAlign:'center'}}>CHECKED</span>
                                                    <span style={{flexGrow: 1, textAlign:'center'}}>STATE: {audit[index] === 1 ? "AGREE" : "REJECT"}</span>
                                                </div>
                                            )
                                    }
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    })
                }
            </div> : <Typography variant="subtitle2" color="textSecondary" align="center">暂没有审核记录</Typography>
    );
}