package team.educoin.transaction.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import team.educoin.transaction.controller.CommonResponse;
import team.educoin.transaction.fabric.AdminFabricClient;
import team.educoin.transaction.fabric.AgencyFabricClient;
import team.educoin.transaction.fabric.UserFabricClient;
import team.educoin.transaction.pojo.AdminInfo;
import team.educoin.transaction.pojo.AgencyInfo;
import team.educoin.transaction.pojo.UserInfo;
import team.educoin.transaction.service.AdminService;
import team.educoin.transaction.service.AgencyService;
import team.educoin.transaction.service.UserService;
import team.educoin.transaction.util.JWTUtil;
import team.educoin.transaction.util.UUIDutil;
import team.educoin.transaction.util.VerifyUtil;

import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

/**
 * @description: 登录注册接口
 * @author: PandaClark
 * @create: 2019-05-23
 */
@RestController
@Api(value = "注册登录 API 接口", tags = "login", description = "注册登录 API 接口")
public class LoginController {


    @Autowired
    private UserService userService;
    @Autowired
    private AgencyService agencyService;
    @Autowired
    private AdminService adminService;
    @Autowired
    private UserFabricClient userFabricClient;
    @Autowired
    private AgencyFabricClient agencyFabricClient;
    @Autowired
    private AdminFabricClient adminFabricClient;


    @ApiOperation(value = "普通用户注册")
    @RequestMapping( value = "/register/user", method = RequestMethod.POST )
    public CommonResponse userRegister(@RequestBody UserInfo userInfo){

        CommonResponse res = null;

        try {
            Map<String,Object> map = new HashMap<>();
            map.put("$class", "org.education.RegisterUser");
            map.put("email", userInfo.getEmail());
            map.put("password", userInfo.getPassword());
            userFabricClient.registerUser(map);
            userService.registerUser(userInfo);
            res = new CommonResponse(0, "success", "注册成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1, "failed", e.getMessage());
        }
        return res;
    }

    @ApiOperation(value = "机构用户注册")
    @RequestMapping( value = "/register/agency", method = RequestMethod.POST )
    public CommonResponse agencyRegister(@RequestBody AgencyInfo agencyInfo){
        CommonResponse res = null;
        agencyInfo.setRegistrationNumber(UUIDutil.getUUID());
        try {
            Map<String,Object> map = new HashMap<>();
            map.put("$class", "org.education.RegisterCompany");
            map.put("email", agencyInfo.getEmail());
            map.put("password", agencyInfo.getPassword());
            map.put("registrationNumber", agencyInfo.getRegistrationNumber());
            agencyFabricClient.registerCompany(map);
            agencyService.registerCompany(agencyInfo);
            res = new CommonResponse(0, "success", "注册成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1, "failed", e.getMessage());
        }
        return res;
    }

    @ApiOperation(value = "管理员用户注册")
    @RequestMapping( value = "/register/admin", method = RequestMethod.POST )
    public CommonResponse adminRegister(@RequestBody AdminInfo adminInfo){
        CommonResponse res = null;

        try {
            Map<String,Object> map = new HashMap<>();
            map.put("$class", "org.education.RegisterUser");
            map.put("email", adminInfo.getEmail());
            map.put("password", adminInfo.getPassword());
            adminFabricClient.registerRegulator(map);
            adminService.registerRegulator(adminInfo);
            res = new CommonResponse(0, "success", "注册成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1, "failed", e.getMessage());
        }
        return res;
    }

    @ApiOperation(value = "普通用户登录")
    @RequestMapping( value = "/login/user", method = RequestMethod.POST )
//    public CommonResponse userLogin(@RequestParam("email") String email, @RequestParam("password") String password){
    public CommonResponse userLogin(@RequestBody HashMap<String, String> map){
        CommonResponse res = null;
        String email = map.get("email");
        String password = map.get("password");
        UserInfo user = userService.getUserById(email);
        if (user == null){
            res = new CommonResponse(1,"failed","该用户未注册");
            return res;
        }
        if ( !user.getPassword().equals(password) ){
            res = new CommonResponse(1,"failed","密码错误");
            return res;
        }
        res = new CommonResponse(0,"succ ess","登录成功");
        try {
            String token = JWTUtil.createToken(user.getEmail(), "user");
            res.setData(token);
        } catch (Exception e) {
            e.printStackTrace();
            res.setData("token生成失败!"+e.getMessage());
        }
        return res;
    }


    @ApiOperation(value = "机构用户登录")
    @RequestMapping( value = "/login/agency", method = RequestMethod.POST )
//    public CommonResponse agencyLogin(@RequestParam("email") String email, @RequestParam("password") String password){
    public CommonResponse agencyLogin(@RequestBody HashMap<String, String> map){
        CommonResponse res = null;
        String email = map.get("email");
        String password = map.get("password");
        AgencyInfo agency = agencyService.getAgencyById(email);
        if (agency == null){
            res = new CommonResponse(1,"failed","该用户未注册");
            return res;
        }
        if ( !agency.getPassword().equals(password) ){
            res = new CommonResponse(1,"failed","密码错误");
            return res;
        }
        res = new CommonResponse(0,"success","登录成功");
        try {
            String token = JWTUtil.createToken(agency.getEmail(), "agency");
            res.setData(token);
        } catch (Exception e) {
            e.printStackTrace();
            res.setData("token生成失败!"+e.getMessage());
        }
        return res;
    }

    @ApiOperation(value = "管理员用户登录")
    @RequestMapping( value = "/login/admin", method = RequestMethod.POST )
//    public CommonResponse adminLogin(@RequestParam("email") String email, @RequestParam("password") String password){
    public CommonResponse adminLogin(@RequestBody HashMap<String, String> map){
        CommonResponse res = null;
        String email = map.get("email");
        String password = map.get("password");
        AdminInfo admin = adminService.getAdminById(email);
        if (admin == null){
            res = new CommonResponse(1,"failed","该用户未注册");
            return res;
        }
        if ( !admin.getPassword().equals(password) ){
            res = new CommonResponse(1,"failed","密码错误");
            return res;
        }
        res = new CommonResponse(0,"success","登录成功");
        try {
            String token = JWTUtil.createToken(admin.getEmail(), "admin");
            res.setData(token);
        } catch (Exception e) {
            e.printStackTrace();
            res.setData("token生成失败!"+e.getMessage());
        }
        return res;
    }


    @ApiOperation(value = "查看所有普通用户")
    @RequestMapping( value = "/userlist/user", method = RequestMethod.GET )
    public CommonResponse userList(){
        CommonResponse res = new CommonResponse();
        res.setStatus(0);
        res.setMessage("success");
        res.setData(userService.getUserList());
        return res;
    }


    @ApiOperation(value = "查看所有机构用户")
    @RequestMapping( value = "/userlist/agency", method = RequestMethod.GET )
    public CommonResponse agencyList(){
        CommonResponse res = new CommonResponse();
        res.setStatus(0);
        res.setMessage("success");
        res.setData(agencyService.getAgencyList());
        return res;
    }


    @ApiOperation(value = "查看所有管理员用户")
    @RequestMapping( value = "/userlist/admin", method = RequestMethod.GET )
    public CommonResponse adminList(){
        CommonResponse res = new CommonResponse();
        res.setStatus(0);
        res.setMessage("success");
        res.setData(adminService.getAdminList());
        return res;
    }


    @ApiOperation(value = "删除普通用户")
    @RequestMapping( value = "/deleteuser/user/{email}", method = RequestMethod.DELETE )
    public CommonResponse deleteUSer(@PathVariable("email") String email){
        CommonResponse res = null;
        try {
            userFabricClient.deleteUser(email);
            userService.deleteUser(email);
            res = new CommonResponse(0, "success", "删除用户成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1, "failed", e.getMessage());
        }
        return res;
    }


    @ApiOperation(value = "删除机构用户")
    @RequestMapping( value = "/deleteuser/agency/{email}", method = RequestMethod.DELETE )
    public CommonResponse deleteAgency(@PathVariable("email") String email){
        CommonResponse res = null;
        try {
            agencyFabricClient.deleteAgency(email);
            agencyService.deleteAgency(email);
            res = new CommonResponse(0, "success", "删除用户成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1, "failed", e.getMessage());
        }
        return res;
    }


    @ApiOperation(value = "删除管理员用户")
    @RequestMapping( value = "/deleteuser/admin/{email}", method = RequestMethod.DELETE )
    public CommonResponse deleteAdmin(@PathVariable("email") String email){
        CommonResponse res = null;
        try {
            adminFabricClient.deleteAdmin(email);
            adminService.deleteAdmin(email);
            res = new CommonResponse(0, "success", "删除用户成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1, "failed", e.getMessage());
        }
        return res;
    }


    @ApiOperation(value = "修改普通用户信息")
    @RequestMapping( value = "/modifyuser/user/{email}", method = RequestMethod.POST )
    public CommonResponse modifyUser(@PathVariable("email") String email,
                                     @RequestParam("qq") String qq,
                                     @RequestParam("identityCard") String identityCard,
                                     @RequestParam("buyerType") String buyerType,
                                     @RequestParam("age") Integer age,
                                     @RequestParam("sexual") String sexual,
                                     @RequestParam("educationLevel") String educationLevel,
                                     @RequestParam("address") String address,
                                     @RequestParam("bankAccount") String bankAccount){

        UserInfo userInfo = new UserInfo(email, qq, identityCard, buyerType, age, sexual, educationLevel, address, bankAccount);
        CommonResponse res = null;
        try {
            userService.updateUserInfo(userInfo);
            res = new CommonResponse(0,"success","修改信息成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1,"failed",e.getMessage());
        }
        return res;
    }


    @ApiOperation(value = "修改机构用户信息")
    @RequestMapping( value = "/modifyuser/agency/{email}", method = RequestMethod.POST )
    public CommonResponse modifyAgency(@PathVariable("email") String email,
                                       @RequestParam("registrationNumber") String registrationNumber,
                                       @RequestParam("address") String address,
                                       @RequestParam("businessScope") String bussinessScope,
                                       @RequestParam("yycode") String yycode,
                                       @RequestParam("type") String type,
                                       @RequestParam("qq") String qq,
                                       @RequestParam("legalRepresentative") String legalRepresentative,
                                       @RequestParam("identityCard") String identityCard,
                                       @RequestParam("bankAccount") String bankAccount){

        AgencyInfo agencyInfo = new AgencyInfo(email,registrationNumber, address, bussinessScope, yycode, type,qq,legalRepresentative,identityCard, bankAccount);
        CommonResponse res = null;
        try {
            agencyService.updateAgencyInfo(agencyInfo);
            res = new CommonResponse(0,"success","修改信息成功");
        } catch (Exception e){
            e.printStackTrace();
            res = new CommonResponse(1,"failed",e.getMessage());
        }
        return res;
    }

    @ApiOperation(value = "虹膜登录")
    @RequestMapping( value = "/login/iris", method = RequestMethod.POST )
    public String isis(@RequestParam("email") String email, @RequestParam("type") String userType) throws Exception {
        // 之前讨论的方案，校验部分放在服务端由 jni 来调用
        // 后由于功能耦合度太高无法拆分换了其他方案
        // boolean res = VerifyUtil.verifyFingerprint("panda", "monkey");

        boolean isEmailExist = false;

        System.out.println("email: "+email);
        System.out.println("type: "+userType);

        // 判断用户类型，同时查询是否存在该用户，用户类型需要写入到 token 中
        switch (userType) {
            case "user":
                UserInfo userById = userService.getUserById(email);
                if (userById != null) isEmailExist = true;
                break;
            case "agency":
                AgencyInfo agencyInfo = agencyService.getAgencyById(email);
                if (agencyInfo != null) isEmailExist = true;
                break;
            case "admin":
                AdminInfo adminInfo = adminService.getAdminById(email);
                if (adminInfo != null) isEmailExist = true;
                break;
        }

        if (!isEmailExist){
            return "用户不存在！";
        }
        String token = JWTUtil.createToken(email, userType);

        System.out.println("iris login token: " + token);

        return token;
    }


    @ApiOperation(value = "指纹登录")
    @RequestMapping( value = "/login/finpr", method = RequestMethod.POST )
    public String fingerprint(@RequestParam("email") String email, @RequestParam("type") String userType) throws Exception {

        boolean isEmailExist = false;

        System.out.println("email: "+email);
        System.out.println("type: "+userType);

        // 判断用户类型，同时查询是否存在该用户，用户类型需要写入到 token 中
        switch (userType) {
            case "user":
                UserInfo userById = userService.getUserById(email);
                if (userById != null) isEmailExist = true;
                break;
            case "agency":
                AgencyInfo agencyInfo = agencyService.getAgencyById(email);
                if (agencyInfo != null) isEmailExist = true;
                break;
            case "admin":
                AdminInfo adminInfo = adminService.getAdminById(email);
                if (adminInfo != null) isEmailExist = true;
                break;
        }

        if (!isEmailExist){
            return "用户不存在！";
        }
        String token = JWTUtil.createToken(email, userType);

        System.out.println("fingerprint login token: " + token);

        return token;
    }


    @RequestMapping( value = "/login/frp", method = {RequestMethod.GET, RequestMethod.POST} )
    public String testFrp(HttpServletRequest request) {
        String uri = request.getRequestURI();
        System.out.println("uri:"+uri);
        return "<h3 style='color:pink;text-align:center;margin-top:300px'>hello, 你看到这段文字说明你已经成功通过内网穿透访问到我的应用<br/>现在开始开发和测试吧！</h3>";
    }


    @RequestMapping( value = "/login/test", method = RequestMethod.GET )
    public String test() throws FileNotFoundException {

        String classpath = ResourceUtils.getURL("classpath").getPath();
        System.out.println("classpath: "+classpath);

        String resources = ResourceUtils.getURL("resources").getPath();
        System.out.println("resources: "+resources);

        String watermark = ResourceUtils.getURL("resources/watermark").getPath();
        System.out.println("watermark: "+watermark);

        String pos = ResourceUtils.getURL("resources/watermark/pdf_watermark_embed.py").getPath();
        System.out.println("pos: "+pos);

        // String pos = ResourceUtils.getURL("classpath:static/watermark/pdf_watermark_embed.py").getPath();
        // System.out.println("path: "+pos);

        return "";

    }

}
