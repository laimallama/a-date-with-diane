function start() {
  s(TEXT.x00003);
  s(TEXT.x00004);
  s(TEXT.x00005);
  c("start1", TEXT.x00006);
  c("start1a", TEXT.x00007);
}
function start1() {
  s(TEXT.x00008);
  s(TEXT.x00009);
  s(TEXT.x00010);
  s(TEXT.x00011);
  s(TEXT.x00012);
  s(TEXT.x00013);
  s(TEXT.x00014);
  s(TEXT.x05011);
  s(TEXT.x05012);
  s(TEXT.x05013);
  s(TEXT.x05013a);
  s(TEXT.x05014);
  s(TEXT.x05015);
  s(TEXT.x05016);
  s(TEXT.x05017);
  s(TEXT.x05018);
  s(TEXT.x05019);
  c("start1a", TEXT.x00015);
  c("info", TEXT.x00016);
}
function info() {
  s(TEXT.x00017);
  s(TEXT.x00018);
  s(TEXT.x00019);
  s(TEXT.x00021);
  s(TEXT.x00023);
  s(TEXT.x05020);
  c("start1a", TEXT.x05070);
}
function start1a() {
  s(TEXT.x00026);
  s(TEXT.x00027);
  s(TEXT.x00028);
  c("start1b", TEXT.x00029);
}
function start1b() {
  s(TEXT.x00030);
  s(TEXT.x00031);
  s(TEXT.x00032);
  c("tuesdaydate", TEXT.x00033);
  c("thursdaydate", TEXT.x00034);
  c("saturdaydate", TEXT.x00035);
}
function tuesdaydate() {
  s(TEXT.x00036);
  s(TEXT.x00037);
  getinti(5);
  tuesday = 2;
  c("start2", TEXT.x00038);
}
function thursdaydate() {
  s(TEXT.x00039);
  s(TEXT.x00040);
  getinti(-1);
  thursday = 2;
  c("start2", TEXT.x00041);
}
function saturdaydate() {
  s(TEXT.x00042);
  s(TEXT.x00043);
  s(TEXT.x00044);
  getinti(-1);
  saturday = 2;
  s(TEXT.x00045);
  pounds -= 10;
  c("start2", TEXT.x00046);
}
function start2() {
  s(TEXT.x00047);
  c("buysth", TEXT.x00048);
  c("gothere", TEXT.x00049);
}
function buysth() {
  s(BALANCE.replace("{amount}", formatPounds(pounds, LANGUAGE)));
  s(TEXT.x00051);
  if (!bottlewater) c("buywater", TEXT.x00052);
  if (!brooch) c("buybrooch", TEXT.x00053);
  c("gothere", TEXT.x00054);
}
function buywater() {
  s(TEXT.x00055);
  bottlewater = 1;
  pounds -= 3;
  if (!brooch) c("buysth", TEXT.x00056);
  else c("gothere", TEXT.x05071);
}
function buybrooch() {
  s(TEXT.x00057);
  brooch = 1;
  pounds -= 15;
  s(TEXT.x00058);
  if (!bottlewater) c("buysth", TEXT.x00059);
  else c("gothere", TEXT.x05072);
}
function gothere() {
  s(TEXT.x00060);
  if (saturday) {
    s(TEXT.x00061);
    blad = 0;
    s(TEXT.x00062);
    s(TEXT.x00063);
    proc += 110;
    c("flirt_l", TEXT.x00064);
    c("flirt_m", TEXT.x00065);
    c("flirt_h", TEXT.x00066);
  } else if (tuesday) {
    s(TEXT.x00067);
    s(TEXT.x05073);
    c("flirt_l", TEXT.x00069);
    c("flirt_m", TEXT.x00070);
    c("flirt_h", TEXT.x00071);
    c("winelist", TEXT.x00072);
  } else {
    s(TEXT.x00073);
    s(TEXT.x00074);
    c("flirt_l", TEXT.x00075);
    c("flirt_h", TEXT.x00076);
    c("winelist", TEXT.x00077);
  }
}
function flirt_l() {
  s(TEXT.x00078);
  getinti(1);
  c("winelist", TEXT.x00079);
}
function flirt_m() {
  s(TEXT.x00080);
  getinti(3);
  c("winelist", TEXT.x00081);
}
function flirt_h() {
  s(TEXT.x00082);
  getinti(-1);
  c("winelist", TEXT.x00083);
}
function winelist() {
  s(TEXT.x00084);
  s(TEXT.x00086);
  s(TEXT.x00085);
  s(TEXT.x00088);
  proc += 50;
  pounds -= 2;
  if (saturday) {
    s(TEXT.x00089);
  } else {
    s(TEXT.x00090);
  }
  s(TEXT.x00091);
  c("buyrioja", TEXT.x00092);
  c("buymerlot", TEXT.x00093);
  c("buyburgundy", TEXT.x00094);
  c("buychardonnay", TEXT.x00095);
  c("buyriesling", TEXT.x00096);
  c("buypinot", TEXT.x00097);
}
function buymerlot() {
  if (pounds >= 12) {
    s(TEXT.x00098);
    merlot = 2;
    pounds -= 12;
  } else s(TEXT.x00099);
  c("eatmeal", TEXT.x00100);
}
function buyburgundy() {
  if (pounds >= 20) {
    s(TEXT.x00101);
    burgundy = 2;
    pounds -= 20;
  } else s(TEXT.x00102);
  c("eatmeal", TEXT.x00103);
}
function buychardonnay() {
  if (pounds >= 15) {
    s(TEXT.x00104);
    chardonnay = 2;
    pounds -= 15;
  } else s(TEXT.x00105);
  c("eatmeal", TEXT.x00106);
}
function buyrioja() {
  if (pounds >= 12) {
    s(TEXT.x00107);
    rioja = 2;
    pounds -= 12;
  } else s(TEXT.x00108);
  c("eatmeal", TEXT.x00109);
}
function buyriesling() {
  if (pounds >= 12) {
    s(TEXT.x00110);
    riesling = 2;
    pounds -= 12;
  } else s(TEXT.x00111);
  c("eatmeal", TEXT.x00112);
}
function buypinot() {
  if (pounds >= 10) {
    s(TEXT.x00113);
    pinot = 2;
    pounds -= 10;
  } else s(TEXT.x00114);
  c("eatmeal", TEXT.x00115);
}
function eatmeal() {
  s(TEXT.x00116);
  s(TEXT.x00117);
  proc += 50;
  c("buytort", TEXT.x00122);
  c("buyspagbol", TEXT.x00119);
  c("buyravioli", TEXT.x00120);
  c("buylasagne", TEXT.x00121);
  c("buypizza", TEXT.x00118);
  c("buysteak", TEXT.x00123);
}
function buypizza() {
  if (pounds >= 17) {
    s(TEXT.x00124);
    pizza = 2;
    pounds -= 17;
  } else s(TEXT.x00125);
  c("eatmeal1", TEXT.x00126);
}
function buysteak() {
  if (pounds >= 23) {
    s(TEXT.x00127);
    steak = 2;
    pounds -= 23;
    s(TEXT.x00128);
    c("steak1", TEXT.x00129);
    c("steak2", TEXT.x00130);
    c("steak3", TEXT.x00131);
  } else {
    s(TEXT.x00132);
    c("gameover", TEXT.x00133);
  }
}
function steak1() {
  s(TEXT.x00134);
  c("eatmeal6", TEXT.x00135);
}
function steak2() {
  s(TEXT.x00136);
  mediumsteak = 1;
  c("eatmeal6", TEXT.x00137);
}
function steak3() {
  s(TEXT.x00138);
  s(TEXT.x00139);
  getinti(2);
  c("eatmeal6", TEXT.x00140);
}
function buyspagbol() {
  if (pounds >= 17) {
    s(TEXT.x00141);
    spagbol = 2;
    pounds -= 17;
  } else s(TEXT.x00142);
  c("eatmeal2", TEXT.x00143);
}
function buyravioli() {
  if (pounds >= 16) {
    s(TEXT.x00144);
    ravioli = 2;
    pounds -= 16;
  } else s(TEXT.x00145);
  c("eatmeal3", TEXT.x00146);
}
function buylasagne() {
  if (pounds >= 17) {
    s(TEXT.x00147);
    lasagne = 2;
    pounds -= 17;
  } else s(TEXT.x00148);
  c("eatmeal4", TEXT.x00149);
}
function buytort() {
  if (pounds >= 18) {
    s(TEXT.x00150);
    tort = 2;
    pounds -= 18;
  } else s(TEXT.x00151);
  c("eatmeal5", TEXT.x00152);
}
function eatmeal1() {
  s(TEXT.x00153);
  proc += 100;
  s(TEXT.x00154);
  s(TEXT.x00155);
  s(TEXT.x00156);
  s(TEXT.x00157);
  c("eatmeal1a", TEXT.x00158);
}
function eatmeal1a() {
  s(TEXT.x00159);
  s(TEXT.x00160);
  getinti(-1);
  s(TEXT.x00161);
  s(TEXT.x00162);
  s(TEXT.x00163);
  s(TEXT.x00164);
  s(TEXT.x04944);
  c("eatmeal1b", TEXT.x00165);
}
function eatmeal1b() {
  s(TEXT.x00166);
  s(TEXT.x00167);
  s(TEXT.x00168);
  s(TEXT.x00169);
  s(TEXT.x00170);
  s(TEXT.x00171);
  s(TEXT.x05074);
  s(TEXT.x00173);
  proc += 50;
  s(TEXT.x00174);
  c("eatmeal1c", TEXT.x00175);
}
function eatmeal1c() {
  s(TEXT.x00176);
  s(TEXT.x00177);
  s(TEXT.x00178);
  s(TEXT.x00179);
  c("eatmeal1d", TEXT.x00180);
}
function eatmeal1d() {
  s(TEXT.x00181);
  s(TEXT.x00182);
  s(TEXT.x00183);
  s(TEXT.x00184);
  s(TEXT.x00185);
  proc += 50;
  s(TEXT.x00186);
  c("eatmeal7", TEXT.x00187);
}
function eatmeal2() {
  s(TEXT.x00188);
  proc += 100;
  s(TEXT.x00189);
  s(TEXT.x00190);
  s(TEXT.x00191);
  s(TEXT.x00192);
  c("eatmeal2a", TEXT.x00193);
}
function eatmeal2a() {
  s(TEXT.x00194);
  s(TEXT.x00195);
  getinti(-5);
  s(TEXT.x00196);
  s(TEXT.x00197);
  s(TEXT.x00198);
  s(TEXT.x00199);
  c("eatmeal2b", TEXT.x00200);
}
function eatmeal2b() {
  movingtalking = 1;
  s(TEXT.x00201);
  s(TEXT.x00202);
  s(TEXT.x00203);
  s(TEXT.x00204);
  s(TEXT.x05075);
  s(TEXT.x05076);
  s(TEXT.x00206);
  s(TEXT.x04945);
  proc += 50;
  getinti(-1);
  c("eatmeal2c", TEXT.x00207);
}
function eatmeal2c() {
  s(TEXT.x00208);
  s(TEXT.x00209);
  s(TEXT.x00210);
  s(TEXT.x00211);
  c("eatmeal2d", TEXT.x00212);
}
function eatmeal2d() {
  s(TEXT.x00213);
  s(TEXT.x00214);
  s(TEXT.x00215);
  getinti(2);
  s(TEXT.x00216);
  s(TEXT.x00217);
  proc += 50;
  c("eatmeal7", TEXT.x00218);
}
function eatmeal3() {
  s(TEXT.x00219);
  proc += 100;
  s(TEXT.x00220);
  s(TEXT.x00221);
  s(TEXT.x00222);
  s(TEXT.x00223);
  c("eatmeal3a", TEXT.x00224);
}
function eatmeal3a() {
  s(TEXT.x00225);
  s(TEXT.x00226);
  s(TEXT.x00227);
  s(TEXT.x00228);
  getinti(-3);
  s(TEXT.x00229);
  s(TEXT.x00230);
  c("eatmeal3b", TEXT.x00231);
}
function eatmeal3b() {
  s(TEXT.x00232);
  s(TEXT.x00233);
  s(TEXT.x00234);
  s(TEXT.x00235);
  getinti(1);
  s(TEXT.x00236);
  s(TEXT.x00237);
  c("eatmeal3c", TEXT.x00238);
}
function eatmeal3c() {
  s(TEXT.x00239);
  s(TEXT.x00240);
  s(TEXT.x00241);
  s(TEXT.x00242);
  s(TEXT.x00243);
  c("eatmeal3d", TEXT.x00244);
}
function eatmeal3d() {
  s(TEXT.x00245);
  s(TEXT.x00246);
  s(TEXT.x00247);
  s(TEXT.x00248);
  s(TEXT.x00249);
  getinti(8);
  if (saturday) {
    s(TEXT.x05077);
  } else {
    s(TEXT.x00250);
  }
  s(TEXT.x00251);
  proc += 50;
  s(TEXT.x00252);
  c("eatmeal3e", TEXT.x00253);
}
function eatmeal3e() {
  if (saturday) {
    s(TEXT.x05078);
    getinti(1);
  } else {
    s(TEXT.x00254);
    getinti(1);
  }
  s(TEXT.x00255);
  s(TEXT.x00256);
  proc += 25;
  c("eatmeal7", TEXT.x00257);
}
function eatmeal4() {
  s(TEXT.x00258);
  proc += 100;
  s(TEXT.x00259);
  s(TEXT.x00260);
  s(TEXT.x00261);
  s(TEXT.x00262);
  c("eatmeal4a", TEXT.x00263);
}
function eatmeal4a() {
  s(TEXT.x00264);
  s(TEXT.x00265);
  s(TEXT.x00266);
  s(TEXT.x00267);
  s(TEXT.x04946);
  s(TEXT.x00268);
  s(TEXT.x00269);
  s(TEXT.x04947);
  getinti(10);
  c("eatmeal4b", TEXT.x00270);
}
function eatmeal4b() {
  s(TEXT.x00271);
  s(TEXT.x00272);
  s(TEXT.x00273);
  s(TEXT.x00274);
  getinti(2);
  s(TEXT.x00275);
  s(TEXT.x00276);
  proc += 40;
  c("eatmeal4c", TEXT.x00277);
}
function eatmeal4c() {
  s(TEXT.x00278);
  s(TEXT.x00279);
  s(TEXT.x00280);
  s(TEXT.x00281);
  getinti(2);
  c("eatmeal4d", TEXT.x00282);
}
function eatmeal4d() {
  s(TEXT.x00283);
  s(TEXT.x00284);
  s(TEXT.x00285);
  s(TEXT.x00286);
  s(TEXT.x00287);
  s(TEXT.x00288);
  proc += 40;
  getinti(2);
  c("eatmeal7", TEXT.x00289);
}
function eatmeal5() {
  s(TEXT.x00290);
  proc += 100;
  s(TEXT.x00291);
  s(TEXT.x00292);
  s(TEXT.x00293);
  s(TEXT.x00294);
  c("eatmeal5a", TEXT.x00295);
}
function eatmeal5a() {
  s(TEXT.x00296);
  s(TEXT.x00297);
  s(TEXT.x00298);
  s(TEXT.x00299);
  s(TEXT.x00300);
  s(TEXT.x00301);
  getinti(-2);
  c("eatmeal5b", TEXT.x00302);
}
function eatmeal5b() {
  s(TEXT.x00303);
  s(TEXT.x00304);
  s(TEXT.x00305);
  s(TEXT.x00306);
  s(TEXT.x00307);
  getinti(-1);
  c("eatmeal5c", TEXT.x00308);
}
function eatmeal5c() {
  s(TEXT.x00309);
  c("ownjob", TEXT.x00310);
  c("herjob", TEXT.x00311);
  c("stamptalk", TEXT.x00312);
  c("cartalk", TEXT.x00313);
  c("traintalk", TEXT.x00314);
  c("asklootalk", TEXT.x00315);
}
function asklootalk() {
  s(TEXT.x00316);
  s(TEXT.x00317);
  s(TEXT.x00318);
  s(TEXT.x00319);
  s(TEXT.x00320);
  proc += 60;
  c("asklootalk1", TEXT.x00321);
}
function asklootalk1() {
  buyfiltercoffee = 2;
  pounds -= 2;
  s(TEXT.x00322);
  s(TEXT.x00323);
  s(TEXT.x00324);
  afterpee();
  s(TEXT.x00325);
  c("asklootalk2", TEXT.x00326);
}
function asklootalk2() {
  s(TEXT.x00327);
  c("gotheatre", TEXT.x00328);
}
function ownjob() {
  s(TEXT.x00329);
  s(TEXT.x00330);
  s(TEXT.x00331);
  proc += 40;
  s(TEXT.x00332);
  s(TEXT.x00333);
  s(TEXT.x04948);
  s(TEXT.x00334);
  getinti(3);
  c("eatmeal5d", TEXT.x00335);
}
function herjob() {
  movingtalking = 1;
  s(TEXT.x00336);
  s(TEXT.x00337);
  s(TEXT.x00338);
  s(TEXT.x00339);
  getinti(-3);
  c("eatmeal5d", TEXT.x00340);
}
function stamptalk() {
  s(TEXT.x00341);
  s(TEXT.x00342);
  s(TEXT.x00343);
  s(TEXT.x00344);
  s(TEXT.x00345);
  getinti(3);
  stampstalking = 1;
  c("eatmeal5d", TEXT.x00346);
}
function cartalk() {
  s(TEXT.x00347);
  s(TEXT.x00348);
  s(TEXT.x00349);
  s(TEXT.x05079);
  s(TEXT.x00351);
  s(TEXT.x00352);
  s(TEXT.x00353);
  getinti(-8);
  c("eatmeal5d", TEXT.x00354);
}
function traintalk() {
  s(TEXT.x00355);
  s(TEXT.x00356);
  s(TEXT.x00357);
  s(TEXT.x00358);
  s(TEXT.x00359);
  s(TEXT.x00360);
  s(TEXT.x00361);
  getinti(10);
  traintalking = 1;
  c("traintalk1", TEXT.x00362);
}
function traintalk1() {
  s(TEXT.x00363);
  s(TEXT.x00364);
  s(TEXT.x00365);
  s(TEXT.x00366);
  getinti(5);
  c("traintalk2", TEXT.x00367);
}
function traintalk2() {
  s(TEXT.x00368);
  getinti(5);
  c("eatmeal7", TEXT.x00369);
}
function eatmeal5d() {
  s(TEXT.x00370);
  s(TEXT.x00371);
  c("eatmeal7", TEXT.x00372);
}
function eatmeal6() {
  s(TEXT.x00373);
  proc += 100;
  s(TEXT.x00374);
  s(TEXT.x00375);
  s(TEXT.x00376);
  s(TEXT.x00377);
  c("eatmeal6a", TEXT.x00378);
}
function eatmeal6a() {
  s(TEXT.x00379);
  s(TEXT.x00380);
  s(TEXT.x00381);
  s(TEXT.x00382);
  s(TEXT.x00383);
  s(TEXT.x04949);
  c("eatmeal6b", TEXT.x00384);
}
function eatmeal6b() {
  s(TEXT.x00385);
  s(TEXT.x00386);
  s(TEXT.x00387);
  s(TEXT.x00388);
  s(TEXT.x00389);
  if (saturday) {
    s(TEXT.x00390);
  } else {
    s(TEXT.x00391);
    proc += 100;
  }
  s(TEXT.x00392);
  getinti(2);
  s(TEXT.x00393);
  proc += 100;
  c("eatmeal6c", TEXT.x00394);
}
function eatmeal6c() {
  s(TEXT.x00395);
  s(TEXT.x00396);
  s(TEXT.x00397);
  s(TEXT.x00398);
  s(TEXT.x00399);
  s(TEXT.x00400);
  getinti(-1);
  c("eatmeal5c", TEXT.x00401);
}
function eatmeal7() {
  s(TEXT.x00402);
  if (pinot) s(TEXT.x00403);
  else if (riesling) {
    s(TEXT.x00404);
    proc += 80;
  } else {
    s(TEXT.x00405);
    s(TEXT.x00405a);
    proc += 30;
  }
  c("eatmeal7a", TEXT.x00406);
}
function eatmeal7a() {
  s(TEXT.x00407);
  c("eatmeal7b", TEXT.x00408);
  c("puddings", TEXT.x00409);
}
function puddings() {
  s(TEXT.x00410);
  s(TEXT.x00411);
  c("buytiramisu", TEXT.x00412);
  c("buypannacotta", TEXT.x00413);
  c("buyicecream", TEXT.x00414);
}
function buytiramisu() {
  if (pounds >= 10) {
    s(TEXT.x00415);
    tiramisu = 1;
    pounds -= 10;
    s(TEXT.x00416);
    getinti(+15);
    c("eatmeal7b", TEXT.x00417);
  } else {
    s(TEXT.x00418);
    c("gameover", TEXT.x00419);
  }
}
function buypannacotta() {
  if (pounds >= 8) {
    s(TEXT.x00420);
    pannacotta = 1;
    pounds -= 8;
    proc += 15;
    s(TEXT.x00421);
    getinti(+10);
    c("eatmeal7b", TEXT.x00422);
  } else {
    s(TEXT.x00423);
    c("gameover", TEXT.x00424);
  }
}
function buyicecream() {
  if (pounds >= 6) {
    s(TEXT.x00425);
    icecream = 1;
    pounds -= 6;
    proc += 10;
    s(TEXT.x00426);
    getinti(+5);
    c("eatmeal7b", TEXT.x00427);
  } else {
    s(TEXT.x00428);
    c("gameover", TEXT.x00429);
  }
}
function eatmeal7b() {
  s(TEXT.x00430);
  s(TEXT.x00431);
  s(TEXT.x00432);
  s(TEXT.x00433);
  c("filtercoffee", TEXT.x00434);
  c("cappuccino", TEXT.x00435);
  c("espresso", TEXT.x00436);
}
function filtercoffee() {
  s(TEXT.x00437);
  buyfiltercoffee = 2;
  pounds -= 2;
  s(TEXT.x00438);
  c("eatmeal7bb", TEXT.x00439);
}
function eatmeal7bb() {
  if (pinot) {
    s(TEXT.x05528);
  } else {
    s(TEXT.x00440);
  }
  proc += 60;
  s(TEXT.x00441);
  s(TEXT.x00442);
  s(TEXT.x00443);
  s(TEXT.x00444);
  c("gotheatre", TEXT.x00445);
}
function espresso() {
  s(TEXT.x00446);
  buyespresso = 2;
  pounds -= 3;
  s(TEXT.x00447);
  s(TEXT.x00448);
  getinti(6);
  c("eatmeal7c", TEXT.x00449);
}
function cappuccino() {
  s(TEXT.x00450);
  buycappuccino = 2;
  pounds -= 3.5;
  s(TEXT.x00451);
  s(TEXT.x00452);
  s(TEXT.x00453);
  getinti(-6);
  c("eatmeal7c", TEXT.x00454);
}
function eatmeal7c() {
  if (pinot) {
    s(TEXT.x05529);
  } else {
    s(TEXT.x00455);
  }
  proc += 15;
  s(TEXT.x00456);
  s(TEXT.x00457);
  s(TEXT.x00458);
  c("gotheatre", TEXT.x00459);
}
function gotheatre() {
  s(TEXT.x00460);
  s(TEXT.x00462);
  s(TEXT.x00087);
  s(TEXT.x00464);
  if (blad > 320) {
    s(TEXT.x00465);
    s(TEXT.x00466);
    s(TEXT.x00467);
    c("theatreask", TEXT.x00468);
  } else {
    s(TEXT.x00469);
    buyprogramme = 1;
    s(TEXT.x00470);
    if (pounds >= 10) {
      s(TEXT.x05530);
      wine = 1;
      pounds -= 10;
    } else s(TEXT.x05531);
    c("theatre1", TEXT.x00471);
  }
}
function testtue() {
  s(TEXT.x00472);
  s(TEXT.x00461);
  s(TEXT.x00474);
  c("testtue1", TEXT.x00475);
  c("gotheatre", TEXT.x00476);
}
function testtue1() {
  s(TEXT.x00477);
  if (tiramisu) {
    blad += 95;
    inti += 85;
  } else if (pannacotta) {
    blad += 70;
    inti += 95;
  } else if (icecream) {
    blad += 45;
    inti += 105;
  } else {
    blad += 20;
    inti += 115;
  }
  s(TEXT.x00478);
  s(TEXT.x00479);
  capEndgameLuckshots();
  c("arrivehome", TEXT.x00480);
}
function theatreask() {
  s(TEXT.x00481);
  s(TEXT.x00482);
  c("lethergo", TEXT.x00483);
  c("stopher", TEXT.x00484);
  c("gotoo", TEXT.x00485);
  if (luckshots >= 1) c("luckytrip0", TEXT.x00486);
  s(TEXT.x00463);
  c("testtue", TEXT.x00488);
}
function lethergo() {
  s(TEXT.x00489);
  s(TEXT.x00490);
  getinti(4);
  if (saturday) {
    s(TEXT.x05080);
  } else if (tuesday) {
    s(TEXT.x05081);
  } else {
    s(TEXT.x00491);
  }
  s(TEXT.x00492);
  adjpoints(-5);
  afterpee();
  s(TEXT.x00493);
  if (pounds >= 3) {
    s(TEXT.x00494);
    buyprogramme = 1;
    pounds -= 3;
  } else s(TEXT.x00495);
  if (pounds >= 10) {
    s(TEXT.x00496);
    wine = 1;
    pounds -= 10;
  } else s(TEXT.x00497);
  c("theatre1", TEXT.x00498);
}
function stopher() {
  s(TEXT.x00499);
  s(TEXT.x00500);
  s(TEXT.x00501);
  s(TEXT.x00502);
  if (pounds >= 10) {
    s(TEXT.x00503);
    wine = 1;
    pounds -= 10;
  } else s(TEXT.x00504);
  s(TEXT.x00505);
  getinti(-7);
  s(TEXT.x00506);
  getinti(-2);
  s(TEXT.x00507);
  adjpoints(5);
  c("theatre1", TEXT.x00508);
}
function gotoo() {
  s(TEXT.x00509);
  s(TEXT.x00510);
  getinti(2);
  if (saturday) {
    s(TEXT.x05082);
  } else if (tuesday) {
    s(TEXT.x05083);
  } else {
    s(TEXT.x05084);
  }
  s(TEXT.x00512);
  adjpoints(-6);
  afterpee();
  s(TEXT.x00513);
  if (pounds >= 3) {
    s(TEXT.x00514);
    buyprogramme = 1;
    pounds -= 3;
  } else s(TEXT.x00515);
  if (pounds >= 10) {
    s(TEXT.x00516);
    wine = 1;
    pounds -= 10;
  } else s(TEXT.x00517);
  c("theatre1", TEXT.x00518);
}
function luckytrip0() {
  if (luckshots >= 1) {
    s(TEXT.x00519);
    spendLuckshot();
    s(TEXT.x00520);
    c("luckytrip0a", TEXT.x00521);
  } else {
    s(TEXT.x00522);
    c("gameover", TEXT.x00523);
  }
}
function luckytrip0a() {
  s(TEXT.x00524);
  if (pounds >= 10) {
    s(TEXT.x00525);
    wine = 1;
    pounds -= 10;
  } else s(TEXT.x00526);
  if (pounds >= 3) {
    s(TEXT.x00527);
    buyprogramme = 1;
    pounds -= 3;
  } else s(TEXT.x02053);
  c("luckytrip0b", TEXT.x00528);
}
function luckytrip0b() {
  s(TEXT.x00529);
  if (thursday) {
    s(TEXT.x00530);
    s(TEXT.x00531);
    s(TEXT.x00532);
    adjpoints(3);
  } else {
    s(TEXT.x00533);
    s(TEXT.x00534);
    adjpoints(-5);
    afterpee();
  }
  c("theatre1", TEXT.x00535);
}
function theatre1() {
  s(TEXT.x00536);
  if (buyprogramme) {
    s(TEXT.x00537);
    getinti(5);
  } else {
    s(TEXT.x00538);
    s(TEXT.x00539);
    getinti(-5);
  }
  s(TEXT.x00540);
  c("theatre2", TEXT.x00541);
}
function theatre2() {
  s(TEXT.x00542);
  s(TEXT.x00543);
  s(TEXT.x00544);
  s(TEXT.x00545);
  s(TEXT.x00546);
  c("theatre3a", TEXT.x00547);
  c("theatre3b", TEXT.x00548);
  c("theatre3c", TEXT.x00549);
}
function theatre3a() {
  s(TEXT.x00550);
  if (saturday) {
    s(TEXT.x00551);
    s(TEXT.x00552);
  } else {
    s(TEXT.x00553);
    s(TEXT.x00554);
  }
  s(TEXT.x00555);
  getinti(2);
  c("theatre4", TEXT.x00556);
}
function theatre3b() {
  s(TEXT.x00557);
  sitting_desp();
  s(TEXT.x00558);
  s(TEXT.x00559);
  getinti(-2);
  c("theatre4", TEXT.x00560);
}
function theatre3c() {
  s(TEXT.x00561);
  s(TEXT.x00562);
  s(TEXT.x05085);
  s(TEXT.x00564);
  c("theatre4", TEXT.x00565);
}
function theatre4() {
  s(TEXT.x00566);
  s(TEXT.x00567);
  s(TEXT.x00568);
  c("holdhand", TEXT.x00569);
  c("leanclose", TEXT.x00570);
  c("handonthigh", TEXT.x00571);
  if (saturday) {
    c("underskirt", TEXT.x05086);
  } else {
    c("underskirt", TEXT.x00572);
  }
  c("theatre5", TEXT.x00573);
}
function holdhand() {
  s(TEXT.x00574);
  if (inti < 20) s(TEXT.x00575);
  else if (inti < 40) {
    s(TEXT.x00576);
    getinti(1);
  } else {
    s(TEXT.x00577);
    getinti(2);
  }
  c("theatre5", TEXT.x00578);
}
function leanclose() {
  s(TEXT.x00579);
  if (inti < 20) s(TEXT.x00580);
  else if (inti < 40) s(TEXT.x00581);
  else s(TEXT.x00582);
  getinti(4);
  c("theatre5", TEXT.x00583);
}
function handonthigh() {
  s(TEXT.x00584);
  if (inti < 20) {
    s(TEXT.x00585);
    getinti(-5);
  } else if (inti < 40) s(TEXT.x00586);
  else {
    s(TEXT.x00587);
    getinti(1);
  }
  c("theatre5", TEXT.x00588);
}
function underskirt() {
  if (saturday) {
    s(TEXT.x05087);
  } else {
    s(TEXT.x00589);
  }
  s(TEXT.x00590);
  s(TEXT.x00591);
  getinti(-20);
  c("theatre5", TEXT.x00592);
}
function theatre5() {
  s(TEXT.x00593);
  if (bottlewater) {
    s(TEXT.x00594);
    s(TEXT.x00595);
    proc += 60;
    s(TEXT.x00596);
    s(TEXT.x00597);
    getinti(1);
  } else {
    s(TEXT.x00598);
  }
  c("theatre6", TEXT.x00599);
}
function theatre6() {
  s(TEXT.x00600);
  s(TEXT.x00601);
  s(TEXT.x00602);
  sitting_desp();
  c("theatre7", TEXT.x00603);
}
function theatre7() {
  s(TEXT.x00604);
  s(TEXT.x00605);
  s(TEXT.x00606);
  c("holdhand1", TEXT.x00607);
  c("leanclose1", TEXT.x00608);
  c("handonthigh1", TEXT.x00609);
  if (saturday) {
    c("underskirt1", TEXT.x05088);
  } else {
    c("underskirt1", TEXT.x00610);
  }
  c("theatre8", TEXT.x00611);
}
function holdhand1() {
  s(TEXT.x00612);
  if (inti < 17) s(TEXT.x00613);
  else if (inti < 33) {
    s(TEXT.x00614);
    getinti(1);
  } else {
    s(TEXT.x00615);
    getinti(2);
  }
  c("theatre8", TEXT.x00616);
}
function leanclose1() {
  s(TEXT.x00617);
  if (inti < 17) {
    s(TEXT.x00618);
    getinti(1);
  } else if (inti < 33) {
    s(TEXT.x00619);
    getinti(1);
  } else {
    s(TEXT.x00620);
    getinti(2);
  }
  c("theatre8", TEXT.x00621);
}
function handonthigh1() {
  s(TEXT.x00622);
  if (inti < 20) {
    s(TEXT.x00623);
    getinti(-2);
  } else if (inti < 30) s(TEXT.x00624);
  else {
    s(TEXT.x00625);
    getinti(1);
  }
  c("theatre8", TEXT.x00626);
}
function underskirt1() {
  if (saturday) {
    s(TEXT.x05089);
  } else {
    s(TEXT.x00627);
  }
  s(TEXT.x00628);
  s(TEXT.x00629);
  getinti(-20);
  c("theatre8", TEXT.x00630);
}
function theatre8() {
  s(TEXT.x00631);
  s(TEXT.x00632);
  s(TEXT.x00633);
  s(TEXT.x00634);
  s(TEXT.x00635);
  c("theatre9", TEXT.x00636);
}
function theatre9() {
  s(TEXT.x00637);
  s(TEXT.x00638);
  s(TEXT.x00639);
  s(TEXT.x00640);
  getinti(1);
  s(TEXT.x05090);
  sitting_desp();
  c("theatre10", TEXT.x00642);
}
function theatre10() {
  s(TEXT.x00643);
  s(TEXT.x00644);
  s(TEXT.x00645);
  s(TEXT.x00646);
  c("interval", TEXT.x00647);
}
function interval() {
  s(TEXT.x00648);
  s(TEXT.x00649);
  s(TEXT.x00650);
  s(TEXT.x00651);
  getinti(5);
  s(TEXT.x05091);
  s(TEXT.x00653);
  s(TEXT.x00654);
  s(TEXT.x04950);
  proc += 85;
  c("interval1", TEXT.x00655);
}
function interval1() {
  s(TEXT.x00656);
  s(TEXT.x00657);
  c("askloo", TEXT.x00658);
  c("keepquiet", TEXT.x00659);
  c("gotoo1", TEXT.x00660);
  if (luckshots >= 1) c("luckytrip1", TEXT.x00661);
}
function askloo() {
  s(TEXT.x00662);
  s(TEXT.x00663);
  if (blad > 450) {
    s(TEXT.x00664);
    s(TEXT.x00665);
    s(TEXT.x00666);
    s(TEXT.x00667);
    adjpoints(-4);
    c("keepquiet1", TEXT.x00668);
  } else {
    s(TEXT.x00669);
    getinti(3);
    s(TEXT.x00670);
    s(TEXT.x00671);
    s(TEXT.x04951);
    s(TEXT.x00672);
    adjpoints(-2);
    c("interval2", TEXT.x00673);
  }
}
function keepquiet() {
  s(TEXT.x00674);
  s(TEXT.x00675);
  if (blad > 450) {
    s(TEXT.x00676);
    s(TEXT.x00677);
    s(TEXT.x00678);
    adjpoints(-2);
    c("keepquiet1", TEXT.x00679);
  } else {
    s(TEXT.x00680);
    c("interval2", TEXT.x00681);
  }
}
function keepquiet1() {
  if (saturday) {
    s(TEXT.x00682);
    s(TEXT.x00683);
    s(TEXT.x00684);
    s(TEXT.x00685);
    adjpoints(7);
  } else {
    s(TEXT.x00686);
    afterpee();
    s(TEXT.x00687);
    s(TEXT.x00688);
    getinti(5);
  }
  c("interval3", TEXT.x00689);
}
function gotoo1() {
  s(TEXT.x00690);
  s(TEXT.x00691);
  s(TEXT.x00692);
  s(TEXT.x00693);
  s(TEXT.x00694);
  s(TEXT.x00695);
  s(TEXT.x04952);
  if (blad > 550) {
    s(TEXT.x00696);
    s(TEXT.x00697);
    adjpoints(5);
    c("interval2", TEXT.x00698);
  } else {
    c("interval2", TEXT.x00699);
  }
}
function luckytrip1() {
  if (luckshots >= 1) {
    s(TEXT.x00700);
    spendLuckshot();
    s(TEXT.x00701);
    s(TEXT.x00702);
    s(TEXT.x00703);
    s(TEXT.x00704);
    c("luckytrip1a", TEXT.x00705);
  } else {
    s(TEXT.x00706);
    c("gameover", TEXT.x00707);
  }
}
function luckytrip1a() {
  s(TEXT.x00708);
  if (thursday) {
    s(TEXT.x00709);
    s(TEXT.x00710);
    c("interval3", TEXT.x00711);
  } else if (saturday) {
    s(TEXT.x00712);
    s(TEXT.x00713);
    s(TEXT.x00714);
    s(TEXT.x00715);
    adjpoints(7);
    c("interval3", TEXT.x00716);
  } else {
    s(TEXT.x00717);
    afterpee();
    c("interval2", TEXT.x00718);
  }
}
function interval2() {
  s(TEXT.x00719);
  s(TEXT.x00720);
  if (inti < 25) s(TEXT.x00721);
  else if (inti < 35) s(TEXT.x00722);
  else s(TEXT.x00723);
  c("interval3", TEXT.x00724);
}
function interval3() {
  s(TEXT.x00725);
  s(TEXT.x00726);
  if (blad > 450) s(TEXT.x05092);
  else s(TEXT.x00728);
  s(TEXT.x00729);
  getinti(2);
  s(TEXT.x00730);
  c("act2", TEXT.x00731);
}
function act2() {
  s(TEXT.x00732);
  s(TEXT.x05093);
  if (blad > 525) {
    s(TEXT.x00734);
    s(TEXT.x00735);
    adjpoints(1);
  } else {
    s(TEXT.x00736);
  }
  s(TEXT.x00737);
  s(TEXT.x00737a);
  getinti(2);
  c("act2a", TEXT.x00738);
}
function act2a() {
  if (saturday) {
    s(TEXT.x00739);
    s(TEXT.x00740);
  } else if (tuesday) {
    s(TEXT.x00741);
    if (inti > 50) {
      s(TEXT.x00742);
      s(TEXT.x00743);
      s(TEXT.x00744);
      getinti(2);
    } else {
      s(TEXT.x00745);
      s(TEXT.x00746);
      getinti(1);
    }
  } else if (thursday) {
    s(TEXT.x00747);
    s(TEXT.x00748);
    s(TEXT.x00749);
  }
  c("act2b", TEXT.x00750);
}
function act2b() {
  s(TEXT.x00751);
  s(TEXT.x00752);
  s(TEXT.x00753);
  c("holdhand2", TEXT.x00754);
  c("leanclose2", TEXT.x00755);
  c("handonthigh2", TEXT.x00756);
  if (saturday) {
    c("underskirt2", TEXT.x05094);
  } else {
    c("underskirt2", TEXT.x00757);
  }
  c("act2c", TEXT.x00758);
}
function holdhand2() {
  s(TEXT.x00759);
  if (inti < 20) s(TEXT.x00760);
  else if (inti < 30) {
    s(TEXT.x00761);
    getinti(2);
  } else {
    s(TEXT.x00762);
    getinti(4);
  }
  c("act2c", TEXT.x00763);
}
function leanclose2() {
  s(TEXT.x00764);
  if (inti < 25) s(TEXT.x00765);
  else if (inti < 45) {
    s(TEXT.x00766);
    getinti(2);
  } else {
    s(TEXT.x00767);
    getinti(4);
  }
  c("act2c", TEXT.x00768);
}
function handonthigh2() {
  s(TEXT.x00769);
  if (inti < 25) {
    s(TEXT.x00770);
    getinti(-5);
  } else if (inti < 50) {
    s(TEXT.x00771);
    getinti(-1);
  } else {
    s(TEXT.x05095);
    getinti(2);
  }
  c("act2c", TEXT.x00773);
}
function underskirt2() {
  if (saturday) {
    s(TEXT.x05096);
    s(TEXT.x05097);
  } else {
    s(TEXT.x00774);
    s(TEXT.x00776);
  }
  getinti(-10);
  s(TEXT.x00777);
  c("act2c", TEXT.x00778);
}
function act2c() {
  s(TEXT.x00779);
  s(TEXT.x00780);
  s(TEXT.x00781);
  s(TEXT.x00782);
  s(TEXT.x00783);
  sitting_desp();
  s(TEXT.x00784);
  c("act2d", TEXT.x00785);
}
function act2d() {
  s(TEXT.x00786);
  s(TEXT.x00787);
  s(TEXT.x00788);
  if (blad > 600) s(TEXT.x00789);
  else if (blad > 500) s(TEXT.x00790);
  else s(TEXT.x00791);
  c("act2e", TEXT.x00792);
}
function act2e() {
  s(TEXT.x00793);
  s(TEXT.x00794);
  s(TEXT.x00795);
  if (blad > 600) {
    s(TEXT.x00796);
    getinti(-5);
  } else if (blad > 500) {
    s(TEXT.x00797);
    getinti(-2);
  } else {
    s(TEXT.x00798);
    if (inti > 50) {
      s(TEXT.x05098);
      getinti(2);
    } else {
      s(TEXT.x00800);
    }
  }
  s(TEXT.x00801);
  c("act2f", TEXT.x00802);
}
function act2f() {
  s(TEXT.x00803);
  sitting_desp();
  if (blad > 650) {
    s(TEXT.x05099);
    s(TEXT.x00805);
    s(TEXT.x00806);
    s(TEXT.x00807);
  } else if (blad > 575) {
    s(TEXT.x00808);
  } else {
    s(TEXT.x00809);
  }
  c("act2fa", TEXT.x00810);
}
function act2fa() {
  s(TEXT.x00811);
  if (bottlewater) {
    s(TEXT.x00812);
    if (blad > 650) {
      s(TEXT.x00813);
    } else if (blad > 550) {
      s(TEXT.x00814);
      proc += 25;
      bottlewater -= 1;
    } else {
      s(TEXT.x00815);
      proc += 50;
      bottlewater -= 1;
      getinti(1);
    }
  } else {
    s(TEXT.x00816);
  }
  c("act2g", TEXT.x00817);
}
function act2g() {
  s(TEXT.x00818);
  s(TEXT.x00819);
  s(TEXT.x00820);
  if (blad > 650) {
    s(TEXT.x00821);
    s(TEXT.x00822);
    adjpoints(5);
  } else if (blad > 550) {
    s(TEXT.x00823);
  } else s(TEXT.x00824);
  if (blad <= 550) sitting_desp();
  c("act2h", TEXT.x00825);
}
function act2h() {
  s(TEXT.x00826);
  s(TEXT.x00827);
  s(TEXT.x00828);
  s(TEXT.x00829);
  s(TEXT.x00830);
  if (inti < 20) s(TEXT.x00831);
  else if (inti < 35) {
    s(TEXT.x00832);
    s(TEXT.x05532);
  } else {
    s(TEXT.x00833);
    s(TEXT.x05533);
  }
  c("leavetheatre", TEXT.x00834);
}
function leavetheatre() {
  s(TEXT.x00835);
  if (inti < 20) {
    s(TEXT.x00836);
    s(TEXT.x00837);
    c("gameover", TEXT.x00838);
  } else {
    s(TEXT.x00839);
    s(TEXT.x00840);
    s(TEXT.x00841);
    c("leavetheatre1", TEXT.x00842);
  }
}
function leavetheatre1() {
  s(TEXT.x00843);
  c("foyerbar", TEXT.x00844);
  c("stagedoor", TEXT.x00845);
  c("riversidewalk", TEXT.x00846);
  c("dianechoice", TEXT.x00847);
}
function foyerbar() {
  s(TEXT.x00848);
  s(TEXT.x00849);
  getinti(2);
  c("foyerbar1", TEXT.x00850);
}
function riversidewalk() {
  s(TEXT.x00851);
  if (inti < 50) {
    s(TEXT.x00852);
    if (saturday) {
      s(TEXT.x05100);
    } else {
      s(TEXT.x00853);
    }
    c("gameover", TEXT.x00854);
  } else {
    s(TEXT.x00855);
    getinti(-3);
    s(TEXT.x05101);
    if (saturday) {
      s(TEXT.x05102);
    } else if (tuesday) {
      s(TEXT.x05103);
    } else {
      s(TEXT.x05104);
    }
    afterpee();
    s(TEXT.x00858);
    c("foyerbar1", TEXT.x00859);
  }
}
function dianechoice() {
  s(TEXT.x00860);
  s(TEXT.x00861);
  getinti(5);
  s(TEXT.x00862);
  if (blad > 600) {
    s(TEXT.x05105);
    s(TEXT.x00864);
    adjpoints(-5);
    s(TEXT.x00865);
    afterpee();
    s(TEXT.x00866);
    if (inti > 85) {
      s(TEXT.x00867);
      s(TEXT.x00868);
      adjpoints(-3);
    } else {
      s(TEXT.x00869);
    }
    c("foyerbar1", TEXT.x00870);
  } else if (blad > 450) {
    s(TEXT.x00871);
    c("foyerbar1", TEXT.x00872);
  } else {
    s(TEXT.x00873);
    c("stagedoor", TEXT.x00874);
  }
}
function foyerbar1() {
  s(TEXT.x00875);
  s(TEXT.x00876);
  s(TEXT.x00877);
  s(TEXT.x04953);
  proc += 150;
  s(TEXT.x00878);
  s(TEXT.x04954);
  if (blad > 550) {
    s(TEXT.x00879);
    afterpee();
    s(TEXT.x05106);
  } else {
    s(TEXT.x00881);
  }
  c("foyerbar1a", TEXT.x00882);
}
function foyerbar1a() {
  s(TEXT.x00883);
  if (!bottlewater) {
    s(TEXT.x00884);
    c("buywaterfoyer", TEXT.x00885);
    c("foyerbar2", TEXT.x00886);
  } else {
    c("foyerbar2", TEXT.x05107);
  }
}
function buywaterfoyer() {
  s(TEXT.x00887);
  if (pounds >= 3) {
    s(TEXT.x00888);
    bottlewater = 1;
    pounds -= 3;
    c("foyerbar2", TEXT.x00889);
  } else {
    s(TEXT.x00890);
    c("gameover", TEXT.x00891);
  }
}
function foyerbar2() {
  s(TEXT.x00892);
  s(TEXT.x00893);
  s(TEXT.x00894);
  s(TEXT.x00895);
  c("foyerbar3", TEXT.x00896);
}
function foyerbar3() {
  s(TEXT.x00897);
  if (thursday) {
    s(TEXT.x00898);
    s(TEXT.x00899);
    c("stagedoor5", TEXT.x00900);
  } else {
    s(TEXT.x00901);
    s(TEXT.x00902);
    c("foyerbar4", TEXT.x00903);
  }
}
function foyerbar4() {
  s(TEXT.x00904);
  if (blad > 485) {
    s(TEXT.x00905);
    s(TEXT.x00906);
    c("choosewalk1", TEXT.x00907);
    c("choosepub", TEXT.x00908);
  } else {
    s(TEXT.x00909);
    s(TEXT.x00910);
    c("choosewalk", TEXT.x00911);
    c("choosepub1", TEXT.x00912);
  }
}
function stagedoor() {
  s(TEXT.x00913);
  s(TEXT.x00914);
  s(TEXT.x00915);
  s(TEXT.x00916);
  if (blad > 500) s(TEXT.x00917);
  else {
    s(TEXT.x00918);
    getinti(2);
  }
  s(TEXT.x00919);
  c("stagedoor1", TEXT.x00920);
}
function stagedoor1() {
  s(TEXT.x00921);
  s(TEXT.x00922);
  s(TEXT.x00923);
  blad += 5;
  c("stagedoor2", TEXT.x00924);
}
function stagedoor2() {
  s(TEXT.x00925);
  if (blad > 600) {
    s(TEXT.x00926);
    blad += 5;
    s(TEXT.x00927);
    s(TEXT.x00928);
    adjpoints(4);
  } else {
    s(TEXT.x00929);
    blad += 5;
    standing_desp();
  }
  c("stagedoor3", TEXT.x00930);
}
function stagedoor3() {
  if (blad > 750) {
    s(TEXT.x00931);
    s(TEXT.x00932);
    s(TEXT.x00933);
    s(TEXT.x00934);
    s(TEXT.x00935);
    s(TEXT.x00936);
    afterpee();
    s(TEXT.x00937);
    s(TEXT.x04955);
    s(TEXT.x04956);
    s(TEXT.x00938);
    adjpoints(2);
  } else {
    s(TEXT.x00939);
  }
  c("stagedoor4", TEXT.x00940);
}
function stagedoor4() {
  s(TEXT.x00941);
  blad += 5;
  if (thursday) {
    s(TEXT.x00942);
    s(TEXT.x00943);
    c("stagedoor5", TEXT.x00944);
  }
  if (saturday) {
    s(TEXT.x00945);
    s(TEXT.x00946);
    mollyblad = 100;
    c("stagedoor5a", TEXT.x00947);
  } else if (tuesday) {
    s(TEXT.x00948);
    s(TEXT.x00949);
    c("stagedoor5a", TEXT.x00950);
  }
}
function stagedoor5() {
  s(TEXT.x00951);
  if (blad > 485) {
    s(TEXT.x00952);
    s(TEXT.x00953);
    c("choosewalk1", TEXT.x00954);
    c("choosepub", TEXT.x00955);
  } else {
    s(TEXT.x00956);
    s(TEXT.x00957);
    c("choosewalk", TEXT.x00958);
    c("choosepub1", TEXT.x00959);
  }
}
function stagedoor5a() {
  s(TEXT.x00960);
  if (blad > 485) {
    s(TEXT.x00961);
    s(TEXT.x00962);
    c("choosewalk1", TEXT.x00963);
    c("choosepub", TEXT.x00964);
  } else {
    s(TEXT.x00965);
    s(TEXT.x00966);
    c("choosewalk", TEXT.x00967);
    c("choosepub1", TEXT.x00968);
  }
}
function choosewalk() {
  s(TEXT.x00969);
  s(TEXT.x00970);
  getinti(15);
  mollyblad = 50;
  s(TEXT.x00971);
  c("riverside2", TEXT.x00972);
}
function choosewalk1() {
  s(TEXT.x00973);
  if (blad < 550) {
    s(TEXT.x00974);
    s(TEXT.x04957);
    getinti(-5);
    mollyblad = 75;
  } else if (blad < 625) {
    s(TEXT.x00975);
    s(TEXT.x04958);
    getinti(-15);
  } else {
    s(TEXT.x00976);
    getinti(-25);
  }
  s(TEXT.x00977);
  c("riverside2", TEXT.x00978);
}
function choosepub1() {
  s(TEXT.x00979);
  s(TEXT.x00980);
  getinti(-15);
  s(TEXT.x00981);
  c("pubdrink", TEXT.x00982);
}
function choosepub() {
  s(TEXT.x00983);
  if (blad < 550) {
    s(TEXT.x00984);
    getinti(15);
  } else if (blad < 625) {
    s(TEXT.x00985);
    s(TEXT.x04959);
    getinti(25);
  } else {
    s(TEXT.x00986);
    getinti(35);
  }
  s(TEXT.x00987);
  c("pubdrink", TEXT.x00988);
}
function pubdrink() {
  s(TEXT.x00989);
  s(TEXT.x00991);
  s(TEXT.x00992);
  s(TEXT.x00473);
  s(TEXT.x00994);
  s(TEXT.x00995);
  c("pubdrink1", TEXT.x00996);
}
function pubdrink1() {
  s(TEXT.x00997);
  if (thursday) {
    s(TEXT.x00998);
    proc += 120;
    mollyproc += 200;
  } else {
    s(TEXT.x00999);
    proc += 120;
    mollyproc += 200;
  }
  s(TEXT.x01000);
  if (blad > 525) {
    s(TEXT.x01001);
    afterpee();
    s(TEXT.x05108);
    digestMolly(30);
  } else {
    s(TEXT.x05109);
  }
  c("pubdrink2", TEXT.x01004);
}
function pubdrink2() {
  s(TEXT.x01005);
  s(TEXT.x01006);
  s(TEXT.x01007);
  digestMolly(30);
  c("pubdrink3", TEXT.x01008);
}
function pubdrink3() {
  s(TEXT.x01009);
  digestMolly(30);
  s(TEXT.x01010);
  s(TEXT.x01011);
  s(TEXT.x01012);
  s(TEXT.x01013);
  c("pubdrink4", TEXT.x01014);
}
function pubdrink4() {
  s(TEXT.x01015);
  digestMolly(30);
  if (thursday) {
    s(TEXT.x01016);
    s(TEXT.x01017);
  } else {
    s(TEXT.x01018);
    s(TEXT.x01019);
    s(TEXT.x01020);
    s(TEXT.x01021);
    s(TEXT.x01022);
  }
  s(TEXT.x01023);
  if (pounds >= 7) c("pubdrink4a", TEXT.x01024);
  c("pubdrink6", TEXT.x01025);
}
function pubdrink4a() {
  s(TEXT.x01026);
  if (saturday) {
    s(TEXT.x01027);
  } else {
    s(TEXT.x01028);
  }
  if (saturday) c("pubdrink5", TEXT.x05534);
  else c("pubdrink5", TEXT.x01029);
}
function pubdrink5() {
  if (pounds < 7) {
    s(TEXT.x05184);
    c("pubdrink6", TEXT.x01777);
    return;
  }
  s(TEXT.x01030);
  pounds -= 7;
  if (thursday) {
    s(TEXT.x01031);
    mollyproc += 200;
    mollyblad += 30;
    proc += 80;
  } else if (saturday) {
    s(TEXT.x01032);
    mollyproc += 100;
    mollyblad += 30;
    proc += 120;
  } else {
    s(TEXT.x01033);
    mollyproc += 200;
    mollyblad += 30;
    proc += 80;
  }
  s(TEXT.x01034);
  c("pubdrink6", TEXT.x01035);
}
function pubdrink6() {
  s(TEXT.x01036);
  digestMolly(30);
  s(TEXT.x01037);
  if (saturday) {
    s(TEXT.x01038);
    s(TEXT.x01039);
    leavepub1 = 1;
    if (blad > 670) {
      s(TEXT.x01040);
      afterpee();
    }
    s(TEXT.x01041);
    c("riverside2", TEXT.x01042);
  } else {
    s(TEXT.x01043);
    s(TEXT.x01044);
    leavepub2 = 1;
    c("pubdrink7", TEXT.x01045);
  }
}
function pubdrink7() {
  s(TEXT.x01046);
  digestMolly(30);
  if (blad > 660) {
    s(TEXT.x01047);
    afterpee();
    s(TEXT.x01048);
  }
  s(TEXT.x01049);
  s(TEXT.x01050);
  s(TEXT.x01051);
  c("pubdrink7a", TEXT.x01052);
  c("pubdrink8", TEXT.x01053);
}
function pubdrink7a() {
  s(TEXT.x01054);
  leavepub1 = 1;
  c("riverside2", TEXT.x01055);
}
function pubdrink8() {
  if (thursday) {
    s(TEXT.x01056);
    digestMolly(30);
    proc += 30;
    s(TEXT.x01057);
    leavepub2 = 1;
    c("riverside2", TEXT.x01058);
  } else {
    s(TEXT.x01059);
    s(TEXT.x01060);
    leavepub2 = 1;
    s(TEXT.x01061);
    s(TEXT.x01062);
    mollyproc += 70;
    mollyblad += 30;
    proc += 100;
    c("pubdrink9", TEXT.x01063);
  }
}
function pubdrink9() {
  s(TEXT.x01064);
  if (buycappuccino) {
    s(TEXT.x01065);
    s(TEXT.x01066);
    mollyblad = 130;
    afterpee();
    s(TEXT.x01067);
  } else if (buyespresso) {
    s(TEXT.x01068);
  } else {
    s(TEXT.x01069);
  }
  c("riverside2", TEXT.x01070);
}
function riverside2() {
  s(TEXT.x01071);
  digestMolly(30);
  s(TEXT.x01072);
  blad += 5;
  s(TEXT.x01073);
  if (thursday) s(TEXT.x01074);
  else s(TEXT.x01075);
  s(TEXT.x01076);
  c("riverside3", TEXT.x01077);
}
function riverside3() {
  s(TEXT.x01078);
  s(TEXT.x01080);
  s(TEXT.x01081);
  s(TEXT.x00487);
  s(TEXT.x01083);
  blad += 5;
  digestMolly(30);
  s(TEXT.x01084);
  s(TEXT.x01085);
  if (blad > 575) {
    s(TEXT.x01086);
  } else {
    s(TEXT.x01087);
  }
  c("riverside7", TEXT.x01088);
  c("riverside3aa", TEXT.x01089);
  if (pounds >= 6) c("riverside3ab", TEXT.x01090);
}
function riverside3aa() {
  s(TEXT.x01091);
  proc += 100;
  mollyproc += 100;
  if (blad > 580) {
    s(TEXT.x05110);
    s(TEXT.x01093);
    s(TEXT.x01094);
    s(TEXT.x01095);
    adjpoints(5);
  } else {
    s(TEXT.x05111);
  }
  c("riverside4", TEXT.x01097);
}
function riverside3ab() {
  if (pounds < 6) {
    s(TEXT.x05516);
    c("riverside7", TEXT.x05517);
    return;
  }
  s(TEXT.x01098);
  proc += 145;
  mollyproc += 145;
  pounds -= 6;
  if (blad > 570) {
    s(TEXT.x05112);
    s(TEXT.x01100);
    s(TEXT.x01101);
    s(TEXT.x01102);
    getinti(-10);
    s(TEXT.x01103);
    adjpoints(8);
  } else {
    s(TEXT.x05113);
    getinti(17);
  }
  c("riverside4", TEXT.x01105);
}
function riverside4() {
  s(TEXT.x01106);
  digestMolly(30);
  s(TEXT.x01107);
  s(TEXT.x01108);
  if (thursday) {
    s(TEXT.x01109);
    s(TEXT.x01110);
  } else if (tuesday) {
    s(TEXT.x01111);
    s(TEXT.x01112);
  } else if (saturday) {
    s(TEXT.x01113);
    s(TEXT.x01114);
  }
  s(TEXT.x01115);
  getinti(2);
  c("sitonbench", TEXT.x01116);
}
function sitonbench() {
  if (blad > 600) {
    s(TEXT.x01117);
    digestMolly(30);
    s(TEXT.x01118);
    blad += 5;
  } else {
    s(TEXT.x01119);
    blad += 5;
  }
  if (saturday) s(TEXT.x01120);
  else if (tuesday) {
    s(TEXT.x01121);
  } else if (thursday) {
    s(TEXT.x01122);
  }
  s(TEXT.x01123);
  s(TEXT.x01124);
  c("riverside5", TEXT.x01125);
}
function riverside5() {
  s(TEXT.x01126);
  blad += 5;
  digestMolly(30);
  s(TEXT.x01127);
  pair_bench_desp();
  if (blad > 600) s(TEXT.x01128);
  else if (saturday) {
    s(TEXT.x05114);
  } else {
    s(TEXT.x01129);
  }
  s(TEXT.x01130);
  getinti(5);
  s(TEXT.x01131);
  c("riverside6", TEXT.x01132);
}
function riverside6() {
  s(TEXT.x01133);
  blad += 5;
  digestMolly(30);
  if (thursday) {
    s(TEXT.x01134);
    s(TEXT.x01135);
    getinti(3);
  } else {
    s(TEXT.x01136);
    s(TEXT.x01137);
    getinti(5);
  }
  s(TEXT.x01138);
  if (blad > 650) {
    s(TEXT.x01139);
    s(TEXT.x01140);
    s(TEXT.x01141);
    if (luckshots >= 1) c("luckytrip16", TEXT.x01142);
    c("riverside7", TEXT.x01143);
  } else {
    s(TEXT.x01144);
    c("riverside7", TEXT.x01145);
  }
}
function luckytrip16() {
  if (luckshots >= 1) {
    s(TEXT.x01146);
    spendLuckshot();
    s(TEXT.x01147);
    s(TEXT.x01148);
    s(TEXT.x01149);
    s(TEXT.x01150);
    c("riverside7", TEXT.x01151);
    c("luckytrip16a", TEXT.x01152);
    c("luckytrip16b", TEXT.x01153);
    c("luckytrip16c", TEXT.x01154);
  } else {
    c("gameover", TEXT.x01155);
  }
}
function luckytrip16a() {
  s(TEXT.x01156);
  s(TEXT.x05115);
  s(TEXT.x01158);
  s(TEXT.x01159);
  s(TEXT.x01160);
  getinti(+15);
  s(TEXT.x01161);
  s(TEXT.x01162);
  s(TEXT.x01163);
  c("luckytrip16a1", TEXT.x01164);
  c("luckytrip16a2", TEXT.x01165);
}
function luckytrip16a1() {
  s(TEXT.x01166);
  s(TEXT.x01167);
  s(TEXT.x01168);
  s(TEXT.x01169);
  s(TEXT.x01170);
  s(TEXT.x01171);
  getinti(+25);
  afterpee();
  s(TEXT.x01172);
  adjpoints(-10);
  c("riverside7", TEXT.x01173);
}
function luckytrip16a2() {
  s(TEXT.x01174);
  s(TEXT.x01175);
  s(TEXT.x01176);
  s(TEXT.x01177);
  s(TEXT.x01178);
  getinti(-5);
  afterpee();
  s(TEXT.x01179);
  adjpoints(-10);
  c("riverside7", TEXT.x01180);
}
function luckytrip16b() {
  s(TEXT.x01181);
  s(TEXT.x01182);
  s(TEXT.x01183);
  getinti(-15);
  s(TEXT.x01184);
  s(TEXT.x01185);
  s(TEXT.x01186);
  s(TEXT.x01187);
  adjpoints(5);
  c("luckytrip16ba", TEXT.x01188);
}
function luckytrip16ba() {
  s(TEXT.x01189);
  if (points > 23) {
    s(TEXT.x01190);
    s(TEXT.x01191);
    adjpoints(5);
  } else {
    s(TEXT.x01192);
    s(TEXT.x01193);
    s(TEXT.x01194);
    mollyblad = 0;
    s(TEXT.x01195);
    afterpee();
    s(TEXT.x01196);
    adjpoints(-5);
  }
  c("riverside7", TEXT.x01197);
}
function luckytrip16c() {
  s(TEXT.x01198);
  s(TEXT.x01199);
  s(TEXT.x01200);
  s(TEXT.x01201);
  mollyblad = 0;
  s(TEXT.x01202);
  s(TEXT.x01203);
  afterpee();
  c("riverside7", TEXT.x01204);
}
function riverside7() {
  s(TEXT.x01205);
  digestMolly(30);
  s(TEXT.x01206);
  s(TEXT.x01207);
  proc += 10;
  blad += 10;
  pair_walk_desp();
  if (thursday) {
    s(TEXT.x01208);
    if (blad > 600) {
      s(TEXT.x01209);
    } else {
      s(TEXT.x01210);
    }
  } else {
    s(TEXT.x01211);
    s(TEXT.x01212);
    getinti(5);
    if (blad > 600) {
      s(TEXT.x01213);
    } else {
      s(TEXT.x01214);
    }
  }
  c("riverside8", TEXT.x01215);
}
function riverside8() {
  if (thursday) {
    s(TEXT.x01216);
    blad += 5;
    digestMolly(30);
    s(TEXT.x01217);
    s(TEXT.x01218);
    s(TEXT.x01219);
    s(TEXT.x01220);
    if (blad > 600) {
      s(TEXT.x05116);
      s(TEXT.x01222);
    } else {
      s(TEXT.x01223);
    }
  } else {
    s(TEXT.x01224);
    digestMolly(30);
    s(TEXT.x01225);
  }
  c("riverside9", TEXT.x01226);
}
function riverside9() {
  s(TEXT.x01227);
  blad += 5;
  digestMolly(30);
  if (thursday) {
    s(TEXT.x01228);
    s(TEXT.x01229);
    s(TEXT.x01230);
    s(TEXT.x01231);
    c("riversidepath", TEXT.x01232);
  } else {
    s(TEXT.x01233);
    if (blad > 600) {
      s(TEXT.x01234);
      if (saturday) {
        s(TEXT.x01235);
      }
      s(TEXT.x01236);
    } else {
      s(TEXT.x01237);
    }
    c("riverside10", TEXT.x01238);
  }
}
function riverside10() {
  if (blad > 625) {
    s(TEXT.x01239);
    digestMolly(30);
    s(TEXT.x01240);
    s(TEXT.x01241);
    s(TEXT.x01242);
    s(TEXT.x04960);
    if (inti > 80) {
      s(TEXT.x01243);
      s(TEXT.x04961);
      s(TEXT.x01244);
      s(TEXT.x01245);
      s(TEXT.x01246);
      adjpoints(-2);
    } else {
      s(TEXT.x01247);
      adjpoints(2);
    }
    c("riverside11", TEXT.x01248);
  } else {
    s(TEXT.x01249);
    s(TEXT.x01250);
    c("riverside11", TEXT.x01251);
  }
}
function riverside11() {
  s(TEXT.x01252);
  proc += 5;
  digestMolly(30);
  s(TEXT.x01253);
  pair_walk_desp();
  s(TEXT.x01254);
  c("musictalka", TEXT.x01255);
  c("theatretalka", TEXT.x01256);
  c("stamptalka", TEXT.x01257);
  c("traintalka", TEXT.x01258);
  c("riverside12", TEXT.x01259);
}
function musictalka() {
  s(TEXT.x01260);
  proc += 5;
  digestMolly(30);
  if (spagbol) {
    s(TEXT.x01261);
    s(TEXT.x01262);
    getinti(5);
    s(TEXT.x01263);
    s(TEXT.x01264);
    s(TEXT.x01265);
    s(TEXT.x01266);
  } else {
    s(TEXT.x01267);
    s(TEXT.x01268);
    getinti(-5);
  }
  if (blad > 650 && blad <= 750) {
    s(TEXT.x01269);
  } else if (blad > 750) {
    s(TEXT.x01270);
    getinti(-10);
  } else if (!spagbol) {
    s(TEXT.x01271);
  }
  c("riverside12", TEXT.x01272);
}
function theatretalka() {
  s(TEXT.x01273);
  proc += 5;
  digestMolly(30);
  s(TEXT.x01274);
  s(TEXT.x01275);
  s(TEXT.x05117);
  s(TEXT.x01277);
  theatretalking = 1;
  if (blad > 650 && blad <= 750) {
    s(TEXT.x01278);
    getinti(-5);
  } else if (blad > 750) {
    s(TEXT.x01279);
    getinti(-10);
  } else {
    s(TEXT.x01280);
  }
  c("riverside12", TEXT.x01281);
}
function stamptalka() {
  proc += 5;
  digestMolly(30);
  if (stampstalking) {
    s(TEXT.x01282);
    s(TEXT.x01283);
    s(TEXT.x01284);
  } else {
    s(TEXT.x05535);
    s(TEXT.x05536);
    s(TEXT.x05537);
    s(TEXT.x05538);
  }
  stampstalking = 1;
  s(TEXT.x01285);
  getinti(5);
  if (blad > 650 && blad <= 750) {
    s(TEXT.x01286);
  } else if (blad > 750) {
    s(TEXT.x01287);
  } else {
    s(TEXT.x01288);
  }
  c("riverside12", TEXT.x01289);
}
function traintalka() {
  s(TEXT.x01290);
  s(TEXT.x01291);
  s(TEXT.x01292);
  s(TEXT.x01293);
  s(TEXT.x01294);
  traintalking = 1;
  s(TEXT.x01295);
  s(TEXT.x04962);
  s(TEXT.x04963);
  s(TEXT.x01296);
  getinti(25);
  if (blad > 700) {
    if (points < 20) {
      s(TEXT.x01297);
    } else {
      s(TEXT.x01298);
    }
  } else {
    s(TEXT.x01299);
  }
  c("riverside12", TEXT.x01300);
}
function riverside12() {
  s(TEXT.x01301);
  blad += 5;
  digestMolly(30);
  if (blad > 700) {
    s(TEXT.x01302);
    s(TEXT.x01303);
    adjpoints(5);
  } else {
    s(TEXT.x01304);
  }
  s(TEXT.x01305);
  if (mollyblad > 600) {
    s(TEXT.x01306);
    s(TEXT.x01307);
    s(TEXT.x01308);
    s(TEXT.x05118);
    c("riverside13", TEXT.x01310);
  } else {
    s(TEXT.x01311);
    c("riverside13a", TEXT.x01312);
  }
}
function riverside13() {
  s(TEXT.x01313);
  s(TEXT.x01314);
  s(TEXT.x01315);
  s(TEXT.x01316);
  s(TEXT.x04964);
  s(TEXT.x01317);
  c("riverside13b", TEXT.x01318);
  if (luckshots >= 1) c("luckytrip4", TEXT.x01319);
}
function riverside13b() {
  s(TEXT.x01320);
  mollyblad = 0;
  c("riverside14", TEXT.x01321);
}
function luckytrip4() {
  s(TEXT.x01322);
  spendLuckshot();
  if (inti < 75) {
    s(TEXT.x01323);
    mollyblad = 50;
    c("riverside14", TEXT.x01324);
  } else {
    s(TEXT.x01325);
    s(TEXT.x01326);
    s(TEXT.x01327);
    s(TEXT.x01327b);
    s(TEXT.x01327c);
    s(TEXT.x01328);
    if (tuesday) {
      s(TEXT.x01329);
    } else {
      s(TEXT.x01330);
    }
    s(TEXT.x01331);
    s(TEXT.x05119);
    c("luckytrip4a", TEXT.x01333);
  }
}
function luckytrip4a() {
  s(TEXT.x01334);
  s(TEXT.x01335);
  s(TEXT.x01336);
  s(TEXT.x01337);
  s(TEXT.x01338);
  mollyblad = 50;
  c("luckytrip4b", TEXT.x01339);
}
function luckytrip4b() {
  s(TEXT.x01340);
  if (blad > 750) {
    s(TEXT.x01341);
    s(TEXT.x01342);
    c("luckytrip4c", TEXT.x01343);
  } else {
    s(TEXT.x01344);
    s(TEXT.x01345);
    s(TEXT.x01346);
    s(TEXT.x01347);
    c("riverside14", TEXT.x01348);
  }
}
function luckytrip4c() {
  s(TEXT.x01349);
  afterpee();
  s(TEXT.x01350);
  if (tuesday) {
    s(TEXT.x01351);
  } else {
    s(TEXT.x01352);
  }
  s(TEXT.x01353);
  s(TEXT.x01354);
  if (tuesday) {
    s(TEXT.x01355);
  } else {
    s(TEXT.x05551);
  }
  getinti(15);
  s(TEXT.x01356);
  adjpoints(-8);
  c("luckytrip4d", TEXT.x01357);
}
function luckytrip4d() {
  s(TEXT.x01358);
  s(TEXT.x01359);
  s(TEXT.x05043);
  s(TEXT.x05120);
  s(TEXT.x05121);
  s(TEXT.x01361);
  s(TEXT.x01362);
  s(TEXT.x01363);
  c("riverside15", TEXT.x01364);
}
function riverside13a() {
  s(TEXT.x01365);
  if (blad > 600) {
    s(TEXT.x01366);
  } else {
    s(TEXT.x05539);
  }
  if (blad > 750) {
    s(TEXT.x01367);
    s(TEXT.x01368);
    s(TEXT.x05122);
    s(TEXT.x05123);
    s(TEXT.x05124);
    s(TEXT.x01370);
    s(TEXT.x01371);
    if (saturday) {
      s(TEXT.x01372);
    } else {
      s(TEXT.x01373);
    }
    s(TEXT.x01374);
    c("helpdiane", TEXT.x01375);
  } else {
    s(TEXT.x01376);
    s(TEXT.x01377);
    c("riverside14", TEXT.x01378);
  }
}
function helpdiane() {
  s(TEXT.x01379);
  if (saturday) {
    s(TEXT.x01380);
  } else {
    s(TEXT.x01381);
  }
  s(TEXT.x01382);
  c("helpdiane1a", TEXT.x01383);
  c("helpdiane2a", TEXT.x01384);
  c("helpdiane3a", TEXT.x01385);
  c("helpdiane4a", TEXT.x01386);
}
function helpdiane1a() {
  s(TEXT.x01387);
  s(TEXT.x01388);
  s(TEXT.x05042);
  s(TEXT.x01389);
  s(TEXT.x01390);
  s(TEXT.x05125);
  c("helpdiane1aa", TEXT.x01392);
}
function helpdiane1aa() {
  if (saturday) {
    s(TEXT.x05126);
    s(TEXT.x05127);
  } else {
    s(TEXT.x01393);
    s(TEXT.x01394);
  }
  gopee = 1;
  if (saturday) {
    s(TEXT.x01395);
    s(TEXT.x01396);
  } else if (tuesday) {
    s(TEXT.x01397);
    s(TEXT.x01398);
    getinti(25);
  } else {
    s(TEXT.x01399);
    s(TEXT.x01400);
    getinti(15);
  }
  afterpee();
  s(TEXT.x01401);
  adjpoints(-6);
  c("helpdiane1b", TEXT.x01402);
}
function helpdiane1b() {
  s(TEXT.x01403);
  c("riverside14", TEXT.x01404);
}
function helpdiane2a() {
  s(TEXT.x01405);
  s(TEXT.x01406);
  s(TEXT.x01407);
  c("together1", TEXT.x01408);
  c("together2", TEXT.x01409);
  c("helpdiane3a", TEXT.x01410);
}
function together1() {
  s(TEXT.x01411);
  s(TEXT.x01412);
  getinti(10);
  s(TEXT.x01413);
  s(TEXT.x01414);
  s(TEXT.x05128);
  s(TEXT.x05129);
  s(TEXT.x01416);
  c("together1a", TEXT.x01417);
}
function together1a() {
  if (saturday) {
    s(TEXT.x05130);
    s(TEXT.x01419);
    s(TEXT.x01420);
    s(TEXT.x01421);
    gopee = 1;
    s(TEXT.x05131);
    afterpee();
    s(TEXT.x05132);
    adjpoints(-2);
    c("together1b", TEXT.x01424);
  } else if (tuesday) {
    s(TEXT.x05133);
    s(TEXT.x01426);
    s(TEXT.x01427);
    s(TEXT.x01428);
    gopee = 1;
    s(TEXT.x05134);
    afterpee();
    s(TEXT.x01430);
    adjpoints(-3);
    c("together1b", TEXT.x01431);
  } else {
    s(TEXT.x05135);
    s(TEXT.x05136);
    s(TEXT.x05137);
    s(TEXT.x05138);
    gopee = 1;
    s(TEXT.x05139);
    afterpee();
    s(TEXT.x05140);
    adjpoints(-3);
    c("together1b", TEXT.x05141);
  }
}
function together1b() {
  s(TEXT.x01432);
  s(TEXT.x01433);
  s(TEXT.x01434);
  getinti(25);
  s(TEXT.x01435);
  if (icecream) {
    s(TEXT.x05142);
    s(TEXT.x01437);
  } else {
    s(TEXT.x05143);
    s(TEXT.x01439);
    s(TEXT.x01440);
    admitwetting = 1;
    s(TEXT.x01441);
    s(TEXT.x01442);
    adjpoints(-10);
  }
  c("riverside15", TEXT.x01443);
}
function together2() {
  s(TEXT.x01444);
  s(TEXT.x01445);
  s(TEXT.x01446);
  s(TEXT.x01447);
  s(TEXT.x01448);
  s(TEXT.x04965);
  s(TEXT.x01449);
  if (saturday) {
    s(TEXT.x05144);
  } else {
    s(TEXT.x01450);
  }
  gopee = 1;
  if (saturday) {
    s(TEXT.x01451);
  } else {
    s(TEXT.x01452);
  }
  s(TEXT.x01453);
  getinti(25);
  afterpee();
  s(TEXT.x01454);
  adjpoints(-8);
  c("helpdiane1b", TEXT.x01455);
}
function helpdiane3a() {
  s(TEXT.x01456);
  s(TEXT.x01457);
  c("riverside14", TEXT.x01458);
}
function riverside14() {
  s(TEXT.x01459);
  s(TEXT.x01461);
  s(TEXT.x01462);
  s(TEXT.x00990);
  s(TEXT.x01464);
  proc += 5;
  s(TEXT.x01465);
  s(TEXT.x01466);
  if (leavepub2) {
    s(TEXT.x01467);
    c("toiletclosed", TEXT.x01468);
  } else if (leavepub1) {
    s(TEXT.x01469);
    c("justclosed", TEXT.x01470);
  } else {
    s(TEXT.x01471);
    c("toiletopen", TEXT.x01472);
  }
}
function toiletclosed() {
  s(TEXT.x01473);
  if (blad > 775) {
    s(TEXT.x01474);
    s(TEXT.x01475);
    s(TEXT.x01476);
    s(TEXT.x01477);
    s(TEXT.x01478);
    c("toiletclosed1", TEXT.x01479);
  } else if (blad > 650) {
    s(TEXT.x01480);
    s(TEXT.x01481);
    s(TEXT.x01482);
    c("riverside15", TEXT.x01483);
  } else {
    s(TEXT.x01484);
    s(TEXT.x01485);
    c("riverside15", TEXT.x01486);
  }
}
function toiletclosed1() {
  s(TEXT.x01487);
  if (blad < 710) {
    s(TEXT.x01488);
    s(TEXT.x01489);
    c("riverside15", TEXT.x01490);
  } else if (blad < 740) {
    s(TEXT.x01491);
    s(TEXT.x01492);
    c("riverside15", TEXT.x01493);
  } else {
    s(TEXT.x01494);
    s(TEXT.x01495);
    s(TEXT.x01496);
    c("toiletclosed2a", TEXT.x01497);
    c("toiletclosed2b", TEXT.x01498);
    c("toiletclosed2c", TEXT.x01499);
  }
}
function toiletclosed2a() {
  s(TEXT.x01500);
  gobehindtoilet = 1;
  s(TEXT.x01501);
  s(TEXT.x01502);
  afterpee();
  getinti(25);
  c("riverside15", TEXT.x01503);
}
function toiletclosed2b() {
  s(TEXT.x01504);
  s(TEXT.x01505);
  s(TEXT.x04966);
  s(TEXT.x04967);
  getinti(+15);
  if (saturday) {
    s(TEXT.x05145);
  } else {
    s(TEXT.x01506);
  }
  gobehindtoilet = 1;
  gopee = 1;
  afterpee();
  s(TEXT.x01507);
  s(TEXT.x01508);
  c("riverside15", TEXT.x01509);
}
function toiletclosed2c() {
  s(TEXT.x01510);
  s(TEXT.x01511);
  s(TEXT.x01512);
  blad = 0;
  s(TEXT.x01513);
  c("gameover", TEXT.x01514);
}
function justclosed() {
  s(TEXT.x01515);
  s(TEXT.x01516);
  if (blad > 700) {
    s(TEXT.x05146);
    s(TEXT.x01518);
    s(TEXT.x01519);
    s(TEXT.x01520);
    s(TEXT.x01521);
    c("justclosed1", TEXT.x01522);
  } else if (blad > 650) {
    s(TEXT.x01523);
    s(TEXT.x01524);
    s(TEXT.x01525);
    c("riverside15", TEXT.x01526);
  } else {
    s(TEXT.x01527);
    s(TEXT.x01528);
    c("riverside15", TEXT.x01529);
  }
}
function justclosed1() {
  s(TEXT.x01530);
  s(TEXT.x01531);
  s(TEXT.x01532);
  s(TEXT.x01533);
  if (pounds >= 10) c("justclosed2", TEXT.x01534);
  c("toiletclosed1", TEXT.x01535);
  c("justcloseda", TEXT.x01536);
}
function justcloseda() {
  s(TEXT.x01537);
  s(TEXT.x01538);
  afterpee();
  s(TEXT.x01539);
  s(TEXT.x01540);
  getinti(-15);
  c("riverside15", TEXT.x01541);
}
function justclosed2() {
  if (pounds < 10) {
    s(TEXT.x05518);
    c("toiletclosed1", TEXT.x05519);
    return;
  }
  s(TEXT.x01542);
  s(TEXT.x01543);
  s(TEXT.x05147);
  s(TEXT.x01545);
  s(TEXT.x01546);
  s(TEXT.x01547);
  s(TEXT.x01548);
  s(TEXT.x05148);
  s(TEXT.x01550);
  pounds -= 10;
  getinti(20);
  c("justclosed3", TEXT.x01551);
}
function justclosed3() {
  s(TEXT.x01552);
  if (saturday) {
    s(TEXT.x01553);
    s(TEXT.x01554);
    s(TEXT.x01555);
    s(TEXT.x01556);
    s(TEXT.x01557);
    s(TEXT.x01558);
    s(TEXT.x01559);
    c("urinal", TEXT.x05149);
  } else {
    s(TEXT.x01561);
    afterpee();
    c("justclosed4", TEXT.x01562);
  }
}
function justclosed4() {
  s(TEXT.x01563);
  s(TEXT.x05150);
  s(TEXT.x01565);
  s(TEXT.x01566);
  c("riverside15", TEXT.x01567);
}
function urinal() {
  s(TEXT.x05151);
  s(TEXT.x01569);
  s(TEXT.x01569b);
  s(TEXT.x01570);
  gourinal = 1;
  gopee = 1;
  afterpee();
  s(TEXT.x05152);
  s(TEXT.x01572);
  getinti(25);
  s(TEXT.x01573);
  s(TEXT.x01574);
  s(TEXT.x01575);
  adjpoints(-20);
  c("riverside15", TEXT.x01576);
}
function toiletopen() {
  if (gopee) {
    s(TEXT.x01577);
    c("riverside15", TEXT.x01578);
  } else {
    s(TEXT.x01579);
    if (saturday) {
      s(TEXT.x01580);
      c("justclosed", TEXT.x01581);
    } else if (blad < 550) {
      s(TEXT.x01582);
      if (points > 30) {
        if (thursday) {
          s(TEXT.x01583);
          c("riverside15", TEXT.x01584);
        } else {
          s(TEXT.x01585);
          s(TEXT.x01586);
          s(TEXT.x01587);
          adjpoints(5);
          s(TEXT.x01588);
          c("toiletopen1c", TEXT.x01589);
        }
      } else {
        s(TEXT.x01590);
        c("riverside15", TEXT.x01591);
      }
    } else if (blad < 725) {
      s(TEXT.x01592);
      s(TEXT.x01593);
      s(TEXT.x01594);
      s(TEXT.x01595);
      c("toiletopen1c", TEXT.x01596);
    } else {
      s(TEXT.x01597);
      c("toiletopen1b", TEXT.x01598);
    }
  }
}
function toiletopen1c() {
  s(TEXT.x01599);
  if (luckshots >= 1) c("luckytrip5m", TEXT.x01600);
  c("toiletopen1c1", TEXT.x01601);
}
function luckytrip5m() {
  if (luckshots >= 1) {
    s(TEXT.x01602);
    spendLuckshot();
    c("luckytrip5n", TEXT.x01603);
  } else {
    s(TEXT.x01604);
    c("gameover", TEXT.x01605);
  }
}
function luckytrip5n() {
  if (pannacotta) {
    s(TEXT.x01606);
    s(TEXT.x01607);
    s(TEXT.x01608);
    c("toiletclosed1", TEXT.x01609);
  } else {
    s(TEXT.x01610);
    c("toiletopen1b", TEXT.x01611);
  }
}
function toiletopen1b() {
  if (blad > 800) {
    s(TEXT.x01612);
  } else {
    s(TEXT.x01613);
    s(TEXT.x01614);
  }
  c("toiletopen1bb", TEXT.x01615);
}
function toiletopen1bb() {
  s(TEXT.x01616);
  s(TEXT.x01617);
  s(TEXT.x01618);
  if (luckshots >= 1) c("luckytrip5", TEXT.x01619);
  c("goforpee", TEXT.x01620);
}
function toiletopen1c1() {
  s(TEXT.x01622);
  s(TEXT.x01623);
  s(TEXT.x01624);
  if (luckshots >= 1) c("luckytrip5c", TEXT.x01625);
  c("goforpee", TEXT.x01626);
}
function goforpee() {
  s(TEXT.x01628);
  afterpee();
  c("goforpee1", TEXT.x01629);
}
function goforpee1() {
  s(TEXT.x01630);
  s(TEXT.x01631);
  c("riverside15", TEXT.x01632);
}
function luckytrip5() {
  if (luckshots >= 1) {
    s(TEXT.x01633);
    spendLuckshot();
    s(TEXT.x01634);
    s(TEXT.x01635);
    c("luckytrip5a", TEXT.x01636);
  } else {
    s(TEXT.x01637);
    c("gameover", TEXT.x01638);
  }
}
function luckytrip5c() {
  if (luckshots >= 1) {
    s(TEXT.x01639);
    spendLuckshot();
    s(TEXT.x01640);
    s(TEXT.x01641);
    c("luckytrip5ca", TEXT.x01642);
  } else {
    s(TEXT.x01643);
    c("gameover", TEXT.x01644);
  }
}
function luckytrip5a() {
  if (tuesday) {
    s(TEXT.x01645);
    s(TEXT.x01646);
    s(TEXT.x01647);
    afterpee();
    s(TEXT.x01648);
    s(TEXT.x01649);
    s(TEXT.x01650);
    c("luckytrip5tue", TEXT.x01651);
  } else if (thursday) {
    s(TEXT.x01652);
    c("luckytrip5cb", TEXT.x01653);
  }
}
function luckytrip5ca() {
  s(TEXT.x01654);
  c("luckytrip5cb", TEXT.x01655);
}
function luckytrip5cb() {
  s(TEXT.x01656);
  s(TEXT.x01657);
  afterpee();
  s(TEXT.x01658);
  s(TEXT.x01659);
  c("luckytrip5cc", TEXT.x01660);
  c("goforpee1", TEXT.x01661);
}
function luckytrip5cc() {
  s(TEXT.x01662);
  s(TEXT.x01663);
  if (tuesday) {
    s(TEXT.x01664);
    s(TEXT.x01665);
    s(TEXT.x01666);
    s(TEXT.x01667);
    c("luckytrip5cd", TEXT.x01668);
  } else {
    c("goforpee1", TEXT.x01669);
  }
}
function luckytrip5cd() {
  s(TEXT.x01670);
  s(TEXT.x01671);
  s(TEXT.x01672);
  getinti(-20);
  s(TEXT.x01673);
  c("riverside15", TEXT.x01674);
}
function luckytrip5tue() {
  s(TEXT.x01675);
  s(TEXT.x01676);
  c("luckytrip5tue1", TEXT.x01677);
}
function luckytrip5tue1() {
  s(TEXT.x01678);
  s(TEXT.x01679);
  s(TEXT.x01680);
  s(TEXT.x01681);
  c("luckytrip5tue2", TEXT.x01682);
}
function luckytrip5tue2() {
  s(TEXT.x01683);
  s(TEXT.x01684);
  s(TEXT.x01685);
  s(TEXT.x01686);
  s(TEXT.x01687);
  c("gameover", TEXT.x01688);
}
function helpdiane4a() {
  s(TEXT.x01689);
  s(TEXT.x05153);
  s(TEXT.x01691);
  s(TEXT.x01692);
  s(TEXT.x01693);
  afterpee();
  getinti(-50);
  s(TEXT.x01694);
  c("riverside14", TEXT.x01695);
}
function riverside15() {
  s(TEXT.x01696);
  s(TEXT.x01697);
  pair_walk_desp();
  s(TEXT.x01698);
  c("riverside16", TEXT.x01699);
}
function riverside16() {
  s(TEXT.x01702);
  if (leavepub2) {
    s(TEXT.x01703);
    if (blad > 710) {
      s(TEXT.x05154);
    } else {
      s(TEXT.x01705);
    }
    s(TEXT.x01706);
    c("riverside16a", TEXT.x01707);
  } else if (leavepub1) {
    if (pounds < 10) {
      s(TEXT.x05520);
      s(TEXT.x01715);
      c("busqueue", TEXT.x01720);
      return;
    }
    s(TEXT.x01708);
    s(TEXT.x01709);
    s(TEXT.x01710);
    pounds -= 10;
    c("pavilion9", TEXT.x01711);
  } else {
    s(TEXT.x01712);
    s(TEXT.x01713);
    c("pavilion", TEXT.x01729);
  }
}
function riverside16a() {
  s(TEXT.x05521);
  if (blad > 700) {
    s(TEXT.x01716);
    if (inti > 100) {
      s(TEXT.x01717);
    } else {
      s(TEXT.x01718);
    }
  } else s(TEXT.x01719);
  c("busqueue", TEXT.x05522);
}
function pavilion() {
  s(TEXT.x01721);
  s(TEXT.x01723);
  s(TEXT.x01724);
  s(TEXT.x00993);
  s(TEXT.x01726);
  s(TEXT.x01727);
  if (blad > 825) {
    s(TEXT.x01728);
    c("pavilion0", TEXT.x01739);
  } else if (blad > 700) {
    s(TEXT.x01730);
    s(TEXT.x01731);
    if (luckshots >= 1) c("luckytrip8", TEXT.x01732);
    c("pavilion1", TEXT.x01733);
  } else if (blad > 500) {
    s(TEXT.x01734);
    s(TEXT.x04968);
    s(TEXT.x01735);
    if (luckshots >= 1) c("luckytrip8", TEXT.x01736);
    c("pavilion1", TEXT.x01737);
  } else {
    s(TEXT.x01738);
    c("pavilion2", TEXT.x05523);
  }
}
function pavilion0() {
  if (thursday) {
    s(TEXT.x01740);
  } else {
    s(TEXT.x01741);
  }
  s(TEXT.x01742);
  s(TEXT.x01743);
  s(TEXT.x01744);
  s(TEXT.x01745);
  blad = 0;
  c("gameover", TEXT.x01746);
}
function pavilion1() {
  s(TEXT.x01747);
  mollyblad = 0;
  afterpee();
  s(TEXT.x01748);
  c("pavilion2", TEXT.x01749);
}
function pavilion2() {
  s(TEXT.x01750);
  if (thursday) {
    s(TEXT.x01751);
    proc += 200;
    mollyproc += 200;
    s(TEXT.x01752);
  } else {
    s(TEXT.x01753);
    proc += 120;
    mollyproc += 200;
  }
  s(TEXT.x01754);
  s(TEXT.x05155);
  digestMolly(30);
  c("pavilion3", TEXT.x01756);
}
function pavilion3() {
  s(TEXT.x01757);
  s(TEXT.x01758);
  s(TEXT.x01759);
  digestMolly(30);
  sitting_desp();
  c("pavilion4", TEXT.x01760);
  if (!bottlewater) c("morewater", TEXT.x_morewater_choice);
  if (saturday) {
    c("handupskirt", TEXT.x05156);
  } else {
    c("handupskirt", TEXT.x_handupskirt_choice);
  }
}
function morewater() {
  if (pounds >= 3) {
    s(TEXT.x_morewater_a);
    s(TEXT.x_morewater_b);
    bottlewater = 1;
    pounds -= 3;
    s(TEXT.x_morewater_c);
    getinti(-10);
  } else {
    s(TEXT.x05157);
  }
  c("pavilion4", TEXT.x05158);
}
function handupskirt() {
  if (saturday) {
    s(TEXT.x05159);
  } else {
    s(TEXT.x_handupskirt_a);
  }
  s(TEXT.x_handupskirt_b);
  s(TEXT.x_handupskirt_c);
  getinti(-5);
  c("pavilion4", TEXT.x05160);
}
function pavilion4() {
  s(TEXT.x01761);
  s(TEXT.x01762);
  s(TEXT.x01763);
  s(TEXT.x01764);
  s(TEXT.x01765);
  c("pavilion5", TEXT.x01766);
}
function pavilion5() {
  s(TEXT.x01767);
  digestMolly(30);
  if (thursday) {
    s(TEXT.x01768);
    s(TEXT.x01769);
  } else {
    s(TEXT.x01770);
    s(TEXT.x01771);
    s(TEXT.x01772);
    s(TEXT.x01773);
    s(TEXT.x01774);
  }
  s(TEXT.x01775);
  if (pounds >= 7) c("pavilion5a", TEXT.x01776);
  c("pavilion7", TEXT.x05524);
}
function pavilion5a() {
  s(TEXT.x01778);
  if (saturday) {
    s(TEXT.x01779);
  } else {
    s(TEXT.x01780);
  }
  c("pavilion6", TEXT.x01781);
}
function pavilion6() {
  if (pounds < 7) {
    s(TEXT.x05525);
    c("pavilion7", TEXT.x05526);
    return;
  }
  s(TEXT.x01782);
  pounds -= 7;
  if (thursday) {
    s(TEXT.x01783);
    mollyproc += 200;
    mollyblad += 30;
    proc += 120;
  } else if (saturday) {
    s(TEXT.x01784);
    mollyproc += 100;
    mollyblad += 30;
    proc += 120;
  } else {
    s(TEXT.x01785);
    mollyproc += 200;
    mollyblad += 30;
    proc += 120;
  }
  s(TEXT.x01786);
  c("pavilion7", TEXT.x01787);
}
function pavilion7() {
  s(TEXT.x01788);
  sitting_desp();
  if (!bottlewater) {
    s(TEXT.x01789);
    c("buywaterpav", TEXT.x01790);
    c("pavilion8", TEXT.x01791);
  } else {
    c("pavilion8", TEXT.x05161);
  }
}
function buywaterpav() {
  s(TEXT.x01792);
  if (pounds >= 3) {
    s(TEXT.x01793);
    bottlewater = 1;
    pounds -= 3;
  } else s(TEXT.x01794);
  c("pavilion8", TEXT.x01795);
}
function pavilion8() {
  s(TEXT.x01796);
  if (blad > 600) {
    s(TEXT.x01797);
    s(TEXT.x01798);
    adjpoints(3);
  } else {
    s(TEXT.x01799);
  }
  s(TEXT.x01800);
  if (thursday) {
    s(TEXT.x01801);
    digestMolly(30);
    proc += 30;
    s(TEXT.x01802);
    c("pavilion9", TEXT.x01803);
  } else {
    s(TEXT.x01804);
    s(TEXT.x01805);
    s(TEXT.x01806);
    s(TEXT.x01807);
    mollyproc += 100;
    mollyblad += 30;
    proc += 100;
    c("pavilion9", TEXT.x01808);
  }
}
function pavilion9() {
  s(TEXT.x01809);
  if (blad > 500) {
    s(TEXT.x01810);
    s(TEXT.x01811);
    c("pavilion10", TEXT.x01812);
    c("notime", TEXT.x01813);
    if (luckshots >= 1) c("luckytrip6", TEXT.x01814);
  } else {
    s(TEXT.x05162);
    c("pavilion9a", TEXT.x01816);
  }
}
function pavilion9a() {
  s(TEXT.x01817);
  c("busqueue", TEXT.x01818);
}
function pavilion10() {
  s(TEXT.x01819);
  s(TEXT.x01820);
  mollyblad = 0;
  getinti(10);
  afterpee();
  s(TEXT.x01821);
  c("busqueue", TEXT.x01822);
}
function notime() {
  s(TEXT.x01823);
  if (blad > 700) {
    s(TEXT.x01824);
    s(TEXT.x01825);
    mollyblad = 0;
    getinti(-10);
    afterpee();
    s(TEXT.x01826);
  } else {
    s(TEXT.x01827);
    s(TEXT.x01828);
  }
  c("busqueue", TEXT.x01829);
}
function luckytrip6() {
  if (luckshots >= 1) {
    s(TEXT.x01830);
    spendLuckshot();
    s(TEXT.x01831);
    c("luckytrip6a", TEXT.x01832);
  } else {
    s(TEXT.x01833);
    c("gameover", TEXT.x01834);
  }
}
function luckytrip6a() {
  s(TEXT.x01835);
  if (saturday) {
    s(TEXT.x01836);
    s(TEXT.x01837);
    s(TEXT.x01838);
  } else if (tuesday) {
    s(TEXT.x01839);
    s(TEXT.x01840);
    s(TEXT.x01841);
  } else {
    s(TEXT.x01842);
    mollyblad = 0;
    afterpee();
    s(TEXT.x01843);
    s(TEXT.x01844);
  }
  c("busqueue", TEXT.x01845);
}
function riversidepath() {
  s(TEXT.x01846);
  digestMolly(30);
  if (blad > 650) {
    s(TEXT.x01847);
    s(TEXT.x01848);
    s(TEXT.x01849);
    s(TEXT.x05163);
    s(TEXT.x05164);
    s(TEXT.x01851);
    s(TEXT.x01852);
    s(TEXT.x01853);
    s(TEXT.x01854);
    if (luckshots >= 1) c("luckytrip3", TEXT.x01855);
    c("riversidepath11", TEXT.x01856);
  } else c("riversidepath10a", TEXT.x01857);
}
function riversidepath10a() {
  s(TEXT.x01858);
  c("riversidepath11a", TEXT.x01859);
}
function riversidepath11() {
  s(TEXT.x01860);
  s(TEXT.x01861);
  mollyblad = 0;
  afterpee();
  c("riversidepath11a", TEXT.x01862);
}
function riversidepath11a() {
  s(TEXT.x01863);
  c("riversidepath12x", TEXT.x01864);
}
function riversidepath12x() {
  s(TEXT.x01865);
  c("riverside14", TEXT.x01866);
}
function luckytrip3() {
  if (luckshots >= 1) {
    s(TEXT.x01867);
    spendLuckshot();
    s(TEXT.x05165);
    s(TEXT.x01869);
    s(TEXT.x01870);
    s(TEXT.x01871);
    c("underbridge", TEXT.x01872);
  } else {
    s(TEXT.x01873);
    c("gameover", TEXT.x01874);
  }
}
function underbridge() {
  s(TEXT.x01875);
  digestMolly(30);
  if (blad > 700) {
    s(TEXT.x01876);
  } else {
    s(TEXT.x01877);
  }
  s(TEXT.x01878);
  s(TEXT.x01879);
  s(TEXT.x01880);
  adjpoints(3);
  afterpee();
  s(TEXT.x01881);
  s(TEXT.x01882);
  s(TEXT.x05166);
  c("underbridge2", TEXT.x01884);
}
function underbridge2() {
  s(TEXT.x01885);
  s(TEXT.x01886);
  s(TEXT.x01887);
  mollyblad = 50;
  s(TEXT.x01888);
  s(TEXT.x01889);
  s(TEXT.x01890);
  c("underbridge3", TEXT.x01891);
}
function underbridge3() {
  s(TEXT.x01892);
  s(TEXT.x01893);
  s(TEXT.x01894);
  c("riverside14", TEXT.x01895);
}
function luckytrip8() {
  if (luckshots >= 1) {
    s(TEXT.x01896);
    spendLuckshot();
    c("luckytrip8a", TEXT.x01897);
  } else {
    s(TEXT.x01898);
    c("gameover", TEXT.x01899);
  }
}
function luckytrip8a() {
  s(TEXT.x01900);
  if (blad > 600) {
    s(TEXT.x01901);
    afterpee();
    c("pavilion2", TEXT.x01902);
  } else {
    s(TEXT.x01903);
    s(TEXT.x01904);
    c("pavilion2", TEXT.x01905);
  }
}
function busqueue() {
  s(TEXT.x01906);
  s(TEXT.x01907);
  blad += 20;
  s(TEXT.x01908);
  s(TEXT.x01909);
  pair_walk_desp();
  c("busqueue1", TEXT.x01910);
}
function busqueue1() {
  s(TEXT.x01911);
  s(TEXT.x01912);
  s(TEXT.x01913);
  if (saturday) {
    s(TEXT.x01914);
  } else {
    s(TEXT.x01915);
  }
  s(TEXT.x01916);
  s(TEXT.x01917);
  if (blad > 650) {
    s(TEXT.x01918);
  } else {
    s(TEXT.x01919);
  }
  c("busqueue2", TEXT.x01920);
}
function busqueue2() {
  s(TEXT.x01921);
  if (blad > 650 && blad <= 750) {
    s(TEXT.x01922);
  } else if (blad > 750) {
    s(TEXT.x01923);
  } else {
    s(TEXT.x01924);
  }
  s(TEXT.x01925);
  c("busqueue3", TEXT.x01926);
  c("taxihome", TEXT.x01927);
}
function taxihome() {
  s(TEXT.x01928);
  s(TEXT.x01929);
  getinti(10);
  gettaxi = 1;
  s(TEXT.x01930);
  s(TEXT.x01931);
  if (blad > 775) {
    s(TEXT.x01932);
    s(TEXT.x01933);
    s(TEXT.x01935);
    s(TEXT.x01936);
    adjpoints(-5);
    c("queue1b", TEXT.x01937);
    c("watchdesperate", TEXT.x01938);
  } else {
    s(TEXT.x01939);
    c("taxihome1", TEXT.x01940);
  }
}
function taxihome1() {
  if (saturday) {
    s(TEXT.x01941);
    s(TEXT.x01942);
    queue_desp();
    s(TEXT.x01943);
    c("taxihome2", TEXT.x01944);
  } else {
    s(TEXT.x01945);
    c("taxihome4", TEXT.x01946);
  }
}
function taxihome2() {
  s(TEXT.x01947);
  s(TEXT.x05167);
  if (blad > 700) {
    s(TEXT.x01949);
    s(TEXT.x05168);
    s(TEXT.x05169);
    s(TEXT.x05170);
    s(TEXT.x01951);
    c("taxihome2a", TEXT.x01952);
    c("queue1b", TEXT.x01953);
  } else {
    c("taxihome3", TEXT.x01954);
  }
}
function taxihome2a() {
  s(TEXT.x01955);
  s(TEXT.x01956);
  s(TEXT.x01957);
  if (inti > 100) {
    s(TEXT.x01958);
    s(TEXT.x01959);
    adjpoints(-3);
  } else {
    s(TEXT.x01960);
    s(TEXT.x01961);
    adjpoints(3);
  }
  c("taxihome3", TEXT.x01962);
}
function taxihome3() {
  s(TEXT.x05171);
  s(TEXT.x01964);
  queue_desp();
  c("taxihome4", TEXT.x01965);
}
function taxihome4() {
  s(TEXT.x01966);
  if (bottlewater) {
    if (blad <= 600) {
      s(TEXT.x01967);
      s(TEXT.x01968);
      proc += 100;
      bottlewater -= 1;
      s(TEXT.x01969);
      s(TEXT.x01970);
      getinti(1);
    } else if (blad <= 750) {
      s(TEXT.x04430);
      getinti(1);
      s(TEXT.x04431);
      proc += 25;
    } else {
      s(TEXT.x05172);
      s(TEXT.x05173);
    }
  } else {
    s(TEXT.x01971);
  }
  if (luckshots >= 1) {
    capEndgameLuckshots();
    s(TEXT.x01972);
  }
  c("taxihome4a", TEXT.x01973);
}
function taxihome4a() {
  s(TEXT.x01974);
  s(TEXT.x01975);
  s(TEXT.x01976);
  c("taxiholdhand", TEXT.x01977);
  c("taxiarmround", TEXT.x01978);
  if (saturday) {
    c("taxiupskirt", TEXT.x05174);
  } else {
    c("taxiupskirt", TEXT.x01979);
  }
}
function taxiholdhand() {
  s(TEXT.x01980);
  s(TEXT.x01981);
  getinti(-5);
  c("taxihome5a", TEXT.x01982);
}
function taxiarmround() {
  s(TEXT.x01983);
  s(TEXT.x05175);
  getinti(15);
  s(TEXT.x01985);
  c("taxihome5", TEXT.x01986);
}
function taxihome5() {
  s(TEXT.x01987);
  s(TEXT.x01988);
  if (saturday) {
    s(TEXT.x01989);
    getinti(10);
  } else {
    s(TEXT.x01990);
    s(TEXT.x01991);
    s(TEXT.x01992);
    s(TEXT.x04969);
    getinti(10);
  }
  s(TEXT.x01993);
  if (blad <= 700) sitting_desp();
  c("taxihome6", TEXT.x01994);
}
function taxihome6() {
  s(TEXT.x01995);
  if (blad > 700) {
    s(TEXT.x01996);
    if (traintalking) {
      s(TEXT.x01997);
      s(TEXT.x05176);
      s(TEXT.x05177);
      s(TEXT.x05178);
      s(TEXT.x01999);
      s(TEXT.x02000);
    } else {
      s(TEXT.x02001);
      s(TEXT.x02002);
    }
  } else {
    s(TEXT.x02003);
  }
  c("taxihome7", TEXT.x02004);
}
function taxiupskirt() {
  if (saturday) {
    s(TEXT.x05179);
  } else {
    s(TEXT.x02005);
  }
  if (tuesday) {
    s(TEXT.x02006);
  } else if (thursday) {
    s(TEXT.x02007);
  } else {
    s(TEXT.x02008);
  }
  if (blad > 600) {
    if (saturday) {
      s(TEXT.x05180);
      s(TEXT.x05181);
    } else {
      s(TEXT.x02009);
      s(TEXT.x02010);
    }
  } else {
    if (saturday) {
      s(TEXT.x05182);
    } else {
      s(TEXT.x02011);
    }
  }
  s(TEXT.x02012);
  s(TEXT.x02013);
  s(TEXT.x05183);
  if (inti > 100) {
    s(TEXT.x02015);
    getinti(5);
  } else {
    s(TEXT.x02016);
    getinti(-5);
  }
  c("taxihome5a", TEXT.x02017);
}
function taxihome5a() {
  s(TEXT.x02018);
  s(TEXT.x02019);
  if (tuesday) {
    s(TEXT.x02020);
    s(TEXT.x02021);
    s(TEXT.x02022);
    getinti(-5);
  } else {
    s(TEXT.x02023);
    getinti(3);
  }
  if (blad > 700) {
    s(TEXT.x02024);
  } else if (blad > 600) {
    s(TEXT.x02025);
  } else {
    s(TEXT.x02026);
  }
  if (blad <= 600) sitting_desp();
  c("taxihome6a", TEXT.x02027);
}
function taxihome6a() {
  s(TEXT.x02028);
  if (blad > 710) {
    s(TEXT.x02029);
    s(TEXT.x02030);
  } else if (blad > 600) {
    s(TEXT.x02031);
  } else {
    s(TEXT.x02032);
  }
  s(TEXT.x02033);
  c("taxihome7", TEXT.x02034);
}
function taxihome7() {
  s(TEXT.x02035);
  s(TEXT.x02036);
  if (blad > 800) {
    s(TEXT.x02037);
    s(TEXT.x02038);
    s(TEXT.x02039);
    s(TEXT.x02040);
    c("gameover", TEXT.x02041);
  } else {
    s(TEXT.x02042);
    if (inti < 100) {
      s(TEXT.x02043);
      s(TEXT.x02044);
      c("gameover", TEXT.x02045);
    } else {
      s(TEXT.x02046);
      s(TEXT.x02047);
      s(TEXT.x02048);
      c("taxihome8", TEXT.x02049);
    }
  }
}
function taxihome8() {
  s(TEXT.x02050);
  if (pounds >= 20) {
    s(TEXT.x02051);
    pounds -= 20;
    c("arrivehome", TEXT.x02052);
  } else {
    s(TEXT.x05527);
    s(TEXT.x02054);
    c("gameover", TEXT.x02055);
  }
}
function arrivehome() {
  s(TEXT.x02056);
  if (blad > 720) {
    s(TEXT.x02057);
    if (points < 20) {
      s(TEXT.x02058);
    } else {
      s(TEXT.x02059);
    }
  } else {
    s(TEXT.x02060);
  }
  c("arrivehome0", TEXT.x02061);
}
function arrivehome0() {
  s(TEXT.x02062);
  s(TEXT.x02063);
  if (points < 20) {
    if (blad > 675) {
      s(TEXT.x02064);
      s(TEXT.x02065);
      afterpee();
    } else {
      s(TEXT.x02066);
    }
  } else {
    if (blad > 750) {
      s(TEXT.x02067);
      s(TEXT.x02068);
      afterpee();
      s(TEXT.x02069);
      blad += 200;
    } else {
      s(TEXT.x02070);
    }
  }
  c("arrivehome1", TEXT.x02071);
}
function arrivehome1() {
  if (ravioli || lasagne || tort || spagbol) brotherHome = 1;
  if (ravioli) {
    s(TEXT.x02072);
    c("scenario1", TEXT.x02073);
  } else if (lasagne) {
    s(TEXT.x02074);
    c("scenario2", TEXT.x02075);
  } else if (tort) {
    s(TEXT.x02076);
    c("scenario2", TEXT.x02077);
  } else if (spagbol) {
    s(TEXT.x02078);
    c("scenario4", TEXT.x02079);
  } else {
    s(TEXT.x02080);
    c("scenario8", TEXT.x02081);
  }
}
function scenario4() {
  s(TEXT.x02082);
  s(TEXT.x02083);
  s(TEXT.x02084);
  s(TEXT.x02085);
  s(TEXT.x02086);
  s(TEXT.x02087);
  c("scenario4a", TEXT.x02088);
}
function scenario5a() {
  brotherHome = 1;
  s(TEXT.x02089);
  s(TEXT.x02090);
  s(TEXT.x02091);
  s(TEXT.x02092);
  s(TEXT.x02093);
  c("scenario5aa", TEXT.x02094);
}
function scenario5aa() {
  s(TEXT.x02095);
  c("scenario5b", TEXT.x02096);
}
function scenario5b() {
  s(TEXT.x02097);
  standing_desp();
  c("scenario4b", TEXT.x02098);
}
function scenario4a() {
  s(TEXT.x02099);
  proc += 110;
  standing_desp();
  c("scenario4b", TEXT.x02100);
}
function scenario4b() {
  s(TEXT.x02101);
  s(TEXT.x02102);
  s(TEXT.x02103);
  s(TEXT.x02104);
  c("scenario4c", TEXT.x02105);
}
function scenario4c() {
  s(TEXT.x02106);
  s(TEXT.x02107);
  standing_desp();
  if (blad > 600) {
    s(TEXT.x02108);
  } else {
    s(TEXT.x02109);
  }
  c("scenario4d", TEXT.x02110);
}
function scenario4d() {
  s(TEXT.x02111);
  sitting_desp();
  s(TEXT.x02112);
  s(TEXT.x02113);
  c("scenario4e", TEXT.x02114);
}
function scenario4e() {
  s(TEXT.x02115);
  s(TEXT.x02116);
  s(TEXT.x02117);
  if (merlot) {
    s(TEXT.x02118);
    s(TEXT.x02119);
    s(TEXT.x02120);
    c("scenario3", TEXT.x02121);
  } else {
    s(TEXT.x02122);
    c("scenario4f", TEXT.x02123);
  }
}
function scenario4f() {
  s(TEXT.x02124);
  s(TEXT.x02125);
  s(TEXT.x02126);
  s(TEXT.x02127);
  c("scenario4g", TEXT.x02128);
  c("gonow", TEXT.x02129);
  if (luckshots >= 1) c("luckytrip21", TEXT.x02130);
}
function gonow() {
  s(TEXT.x02131);
  s(TEXT.x02132);
  leavechloe = 1;
  c("walkhomeX", TEXT.x02133);
}
function scenario4g() {
  s(TEXT.x02134);
  s(TEXT.x02135);
  s(TEXT.x02136);
  c("scenario2a", TEXT.x02137);
}
function luckytrip21() {
  if (luckshots >= 1) {
    s(TEXT.x02138);
    spendLuckshot();
    s(TEXT.x02139);
    c("luckytrip21a", TEXT.x02140);
  } else {
    s(TEXT.x02141);
    c("gameover", TEXT.x02142);
  }
}
function luckytrip21a() {
  s(TEXT.x02143);
  s(TEXT.x02144);
  s(TEXT.x02145);
  s(TEXT.x02146);
  s(TEXT.x02147);
  s(TEXT.x02148);
  afterpee();
  c("gameover", TEXT.x02149);
}
function scenario8() {
  s(TEXT.x_scenario8);
  standing_desp();
  s(TEXT.x02151);
  c("coffeeinstant1", TEXT.x02152);
  c("coffeereal1", TEXT.x02153);
  c("cupoftea", TEXT.x02154);
}
function scenario1() {
  s(TEXT.x02150);
  standing_desp();
  s(TEXT.x02321);
  c("coffeeinstant1", TEXT.x02322);
  c("coffeereal1", TEXT.x02323);
  c("cupoftea", TEXT.x05185);
}
function cupoftea() {
  s(TEXT.x02155);
  s(TEXT.x02156);
  s(TEXT.x02157);
  proc += 50;
  getinti(-25);
  c("scenario1c", TEXT.x02158);
}
function coffeeinstant1() {
  s(TEXT.x02159);
  s(TEXT.x02160);
  if (blad > 500 && blad <= 600) {
    s(TEXT.x02161);
  } else if (blad > 600 && blad <= 700) {
    s(TEXT.x02162);
  } else if (blad > 700) {
    s(TEXT.x02163);
  } else {
    s(TEXT.x02164);
  }
  s(TEXT.x02165);
  proc += 100;
  getinti(-5);
  instantcoffee = 1;
  c("scenario1a", TEXT.x02166);
}
function coffeereal1() {
  s(TEXT.x02167);
  s(TEXT.x02168);
  if (blad > 500 && blad <= 600) {
    s(TEXT.x02169);
  } else if (blad > 600 && blad <= 700) {
    s(TEXT.x02170);
  } else if (blad > 700) {
    s(TEXT.x02171);
  } else {
    s(TEXT.x02172);
  }
  s(TEXT.x02173);
  proc += 60;
  s(TEXT.x02174);
  getinti(15);
  nicecoffee = 1;
  s(TEXT.x02175);
  proc += 160;
  c("scenario1a", TEXT.x02176);
}
function scenario1a() {
  s(TEXT.x02177);
  standing_desp();
  s(TEXT.x02178);
  s(TEXT.x02179);
  c("scenario1b", TEXT.x02180);
}
function scenario1b() {
  s(TEXT.x02181);
  s(TEXT.x02182);
  s(TEXT.x02183);
  if (blad > 700) {
    s(TEXT.x02184);
    getinti(2);
  } else {
    s(TEXT.x02185);
    getinti(10);
  }
  s(TEXT.x02186);
  c("scenario1c", TEXT.x02187);
}
function scenario1c() {
  s(TEXT.x02188);
  s(TEXT.x02189);
  if (blad < 600) {
    s(TEXT.x02190);
  } else if (blad < 650) {
    s(TEXT.x02191);
    s(TEXT.x04970);
  } else {
    s(TEXT.x02192);
  }
  if (ravioli) {
    c("scenario3a", TEXT.x02193);
  } else if (pizza) {
    c("scenario3a", TEXT.x02194);
  } else if (steak) {
    c("scenario5", TEXT.x02195);
  } else {
    c("scenario7a", TEXT.x02196);
  }
}
function scenario5() {
  brotherHome = 1;
  s(TEXT.x02197);
  if (blad > 600) {
    s(TEXT.x02198);
  } else {
    s(TEXT.x02199);
  }
  s(TEXT.x02200);
  s(TEXT.x02201);
  s(TEXT.x02202);
  if (saturday) {
    s(TEXT.x02203);
    c("scenario6", TEXT.x02204);
  } else {
    s(TEXT.x02205);
    c("scenario5a", TEXT.x02206);
  }
}
function scenario6() {
  s(TEXT.x02207);
  if (mediumsteak) {
    s(TEXT.x02208);
    s(TEXT.x02209);
    c("scenario3", TEXT.x02210);
  } else {
    s(TEXT.x02211);
    s(TEXT.x02212);
    c("scenario6a", TEXT.x02213);
  }
}
function scenario6a() {
  s(TEXT.x02214);
  s(TEXT.x02215);
  s(TEXT.x02216);
  s(TEXT.x02217);
  s(TEXT.x02218);
  c("scenario6b", TEXT.x02219);
}
function scenario6b() {
  s(TEXT.x02220);
  s(TEXT.x02221);
  s(TEXT.x02222);
  c("scenario6c", TEXT.x02223);
}
function scenario6c() {
  s(TEXT.x02224);
  s(TEXT.x05186);
  s(TEXT.x02226);
  s(TEXT.x02227);
  s(TEXT.x02228);
  c("scenario6d", TEXT.x02229);
  c("goupstairs", TEXT.x02230);
  if (luckshots >= 1) c("luckytrip30", TEXT.x02231);
}
function scenario6d() {
  s(TEXT.x05187);
  s(TEXT.x02233);
  c("walkhomeX", TEXT.x02234);
}
function luckytrip30() {
  if (luckshots >= 1) {
    s(TEXT.x02235);
    spendLuckshot();
    s(TEXT.x02236);
    s(TEXT.x02237);
    s(TEXT.x02238);
    c("goupstairs", TEXT.x02239);
    c("luckytrip30a", TEXT.x02240);
  } else {
    s(TEXT.x02241);
    c("gameover", TEXT.x02242);
  }
}
function luckytrip30a() {
  s(TEXT.x02243);
  s(TEXT.x02244);
  getinti(-20);
  s(TEXT.x02245);
  c("scenario6d", TEXT.x02246);
}
function goupstairs() {
  s(TEXT.x05188);
  getinti(10);
  s(TEXT.x02248);
  c("goupstairs1", TEXT.x02249);
}
function goupstairs1() {
  s(TEXT.x02250);
  c("goupstairs2", TEXT.x02251);
  c("goupstairsloo", TEXT.x02252);
}
function goupstairs2() {
  s(TEXT.x02253);
  s(TEXT.x02254);
  s(TEXT.x02255);
  c("godownstairs", TEXT.x02256);
  c("goupstairs3", TEXT.x02257);
}
function goupstairs3() {
  s(TEXT.x02258);
  s(TEXT.x02259);
  s(TEXT.x02260);
  c("goupstairs4", TEXT.x02261);
}
function goupstairs4() {
  s(TEXT.x05189);
  s(TEXT.x05190);
  s(TEXT.x02264);
  c("goupstairs5", TEXT.x02265);
}
function goupstairs5() {
  s(TEXT.x02266);
  s(TEXT.x05191);
  s(TEXT.x02268);
  if (instantcoffee) {
    s(TEXT.x02269);
  } else {
    s(TEXT.x02270);
    s(TEXT.x02271);
  }
  s(TEXT.x02272);
  c("goupstairs6", TEXT.x02273);
}
function goupstairs6() {
  s(TEXT.x02274);
  c("godownstairs", TEXT.x02275);
  if (luckshots >= 1) c("luckytrip31", TEXT.x02276);
}
function luckytrip31() {
  if (luckshots >= 1) {
    s(TEXT.x02277);
    s(TEXT.x02278);
    spendLuckshot();
    c("luckytrip31a", TEXT.x02279);
  } else {
    s(TEXT.x02280);
    c("gameover", TEXT.x02281);
  }
}
function luckytrip31a() {
  s(TEXT.x02282);
  if (instantcoffee) {
    s(TEXT.x02283);
    s(TEXT.x02284);
    s(TEXT.x02285);
    c("godownstairs", TEXT.x02286);
  } else {
    s(TEXT.x02287);
    s(TEXT.x02288);
    c("luckytrip31b", TEXT.x02289);
  }
}
function luckytrip31b() {
  s(TEXT.x02290);
  s(TEXT.x02291);
  s(TEXT.x02292);
  s(TEXT.x02293);
  s(TEXT.x02294);
  s(TEXT.x02295);
  c("luckytrip31c", TEXT.x02296);
}
function luckytrip31c() {
  s(TEXT.x02297);
  s(TEXT.x02298);
  s(TEXT.x02299);
  s(TEXT.x02300);
  c("luckytrip31d", TEXT.x02301);
}
function luckytrip31d() {
  s(TEXT.x02302);
  s(TEXT.x02303);
  c("luckytrip31e", TEXT.x02304);
}
function luckytrip31e() {
  s(TEXT.x02305);
  s(TEXT.x02306);
  s(TEXT.x02307);
  s(TEXT.x02308);
}
function godownstairs() {
  s(TEXT.x02309);
  getinti(10);
  c("walkhomeX", TEXT.x02310);
}
function goupstairsloo() {
  s(TEXT.x02311);
  c("goupstairsloo1", TEXT.x02312);
}
function goupstairsloo1() {
  s(TEXT.x02313);
  s(TEXT.x02314);
  s(TEXT.x02315);
  c("gameover", TEXT.x02316);
}
function scenario7a() {
  brotherHome = 1;
  s(TEXT.x02317);
  s(TEXT.x02318);
  c("scenario3b", TEXT.x02319);
}
function scenario2() {
  s(TEXT.x02320);
  s(TEXT.x03314);
  c("coffeeinstant2", TEXT.x05192);
  c("coffeereal2", TEXT.x05193);
}
function coffeeinstant2() {
  s(TEXT.x02324);
  standing_desp();
  s(TEXT.x02325);
  if (blad > 500 && blad <= 600) {
    s(TEXT.x02326);
  } else if (blad > 600 && blad <= 700) {
    s(TEXT.x02327);
  } else if (blad > 700) {
    s(TEXT.x02328);
  } else {
    s(TEXT.x02329);
  }
  s(TEXT.x02330);
  proc += 100;
  getinti(-5);
  instantcoffee = 1;
  c("scenario2a", TEXT.x02331);
}
function coffeereal2() {
  s(TEXT.x02332);
  standing_desp();
  s(TEXT.x02333);
  if (blad > 500 && blad <= 600) {
    s(TEXT.x02334);
  } else if (blad > 600 && blad <= 700) {
    s(TEXT.x02335);
  } else if (blad > 700) {
    s(TEXT.x02336);
  } else {
    s(TEXT.x02337);
  }
  s(TEXT.x02338);
  proc += 60;
  getinti(15);
  s(TEXT.x02339);
  nicecoffee = 1;
  s(TEXT.x02340);
  proc += 100;
  c("scenario2a", TEXT.x02341);
}
function scenario2a() {
  s(TEXT.x02342);
  if (blad > 550 && blad <= 625) {
    s(TEXT.x02343);
  } else if (blad > 625 && blad <= 750) {
    s(TEXT.x02344);
  } else if (blad > 750) {
    s(TEXT.x02345);
  }
  if (tort) {
    s(TEXT.x02346);
    c("scenario3", TEXT.x02347);
  } else {
    s(TEXT.x02348);
    c("scenario2b", TEXT.x02349);
  }
}
function scenario2b() {
  s(TEXT.x02350);
  s(TEXT.x02351);
  {
    if (blad > 600 && blad <= 750) s(TEXT.x02352);
    if (blad > 750) s(TEXT.x02353);
    else s(TEXT.x02354);
  }
  s(TEXT.x02355);
  c("scenario2c", TEXT.x02356);
}
function scenario2c() {
  s(TEXT.x02357);
  c("sendbrotheraway", TEXT.x02358);
  c("offertowalkhome", TEXT.x02359);
  c("asklooneed", TEXT.x02360);
}
function sendbrotheraway() {
  s(TEXT.x02361);
  s(TEXT.x02362);
  c("scenario3", TEXT.x02363);
}
function offertowalkhome() {
  s(TEXT.x02364);
  s(TEXT.x02365);
  s(TEXT.x02366);
  s(TEXT.x04971);
  c("gameover", TEXT.x02367);
}
function asklooneed() {
  s(TEXT.x02368);
  if (blad > 540 && blad <= 700) {
    s(TEXT.x02369);
    s(TEXT.x02370);
  } else if (blad > 700) {
    s(TEXT.x02371);
  } else {
    s(TEXT.x02372);
  }
  s(TEXT.x05194);
  if (blad > 600) {
    s(TEXT.x02374);
    s(TEXT.x02375);
  } else {
    s(TEXT.x02376);
  }
  s(TEXT.x02377);
  c("asklooneed1", TEXT.x02378);
}
function asklooneed1() {
  s(TEXT.x02379);
  s(TEXT.x02380);
  if (blad < 500) {
    s(TEXT.x02381);
  } else if (blad < 650) {
    s(TEXT.x02382);
  } else if (blad < 750) {
    s(TEXT.x02383);
  } else {
    s(TEXT.x02384);
  }
  s(TEXT.x02385);
  c("asklooneed2", TEXT.x02386);
}
function asklooneed2() {
  s(TEXT.x02387);
  s(TEXT.x02388);
  c("offercoffeeagain", TEXT.x02389);
  c("offerglasswine", TEXT.x02390);
}
function offerglasswine() {
  s(TEXT.x02391);
  if (saturday) {
    s(TEXT.x02392);
    s(TEXT.x02393);
    proc += 100;
    standing_desp();
    s(TEXT.x02394);
    c("offerglasswine1", TEXT.x02395);
  } else {
    s(TEXT.x02396);
    c("asklooneed3", TEXT.x02397);
  }
}
function offerglasswine1() {
  s(TEXT.x02398);
  if (blad > 625) {
    s(TEXT.x05195);
    s(TEXT.x02400);
    s(TEXT.x02401);
    c("offercoffeeagain1", TEXT.x02402);
  } else {
    s(TEXT.x02403);
    c("asklooneed3", TEXT.x02404);
  }
}
function offercoffeeagain() {
  s(TEXT.x02405);
  if (nicecoffee) {
    s(TEXT.x02406);
    s(TEXT.x02407);
    s(TEXT.x02408);
    proc += 60;
    if (blad < 550) {
      s(TEXT.x05196);
      s(TEXT.x02410);
      getinti(8);
      c("asklooneed3", TEXT.x02411);
    } else {
      s(TEXT.x05197);
      s(TEXT.x02413);
      s(TEXT.x02414);
      c("offercoffeeagain1", TEXT.x02415);
    }
  } else {
    s(TEXT.x02416);
    c("asklooneed3", TEXT.x02417);
  }
}
function asklooneed3() {
  s(TEXT.x02418);
  s(TEXT.x02419);
  s(TEXT.x02420);
  c("readytoleave", TEXT.x02421);
  c("sendbrotheraway", TEXT.x02422);
}
function readytoleave() {
  s(TEXT.x02423);
  s(TEXT.x02424);
  s(TEXT.x02425);
  if (blad > 600) {
    s(TEXT.x02426);
    s(TEXT.x04972);
    c("walkhomeX", TEXT.x02427);
  } else {
    s(TEXT.x02428);
    c("gameover", TEXT.x02429);
  }
}
function offercoffeeagain1() {
  s(TEXT.x02430);
  if (blad > 700) {
    s(TEXT.x02431);
  } else {
    s(TEXT.x02432);
  }
  s(TEXT.x02433);
  s(TEXT.x02434);
  if (luckshots >= 1) c("luckytrip11", TEXT.x02435);
  c("offercoffeeagain2", TEXT.x02436);
}
function offercoffeeagain2() {
  s(TEXT.x02437);
  afterpee();
  s(TEXT.x02438);
  c("gameover", TEXT.x02439);
}
function luckytrip11() {
  if (luckshots >= 1) {
    s(TEXT.x02440);
    spendLuckshot();
    s(TEXT.x02441);
    s(TEXT.x02442);
    c("luckytrip11a", TEXT.x02443);
  } else {
    s(TEXT.x02444);
    c("gameover", TEXT.x02445);
  }
}
function luckytrip11a() {
  if (tuesday) {
    s(TEXT.x02447);
    s(TEXT.x02448);
    afterpee();
    s(TEXT.x02449);
    s(TEXT.x02450);
    c("walkhomeX", TEXT.x02451);
  } else if (thursday) {
    s(TEXT.x02452);
    s(TEXT.x02453);
    s(TEXT.x02454);
    c("hiddencamera", TEXT.x02455);
  } else {
    s(TEXT.x05198);
    s(TEXT.x02457);
    s(TEXT.x05199);
    s(TEXT.x02459);
    if (blad > 700) {
      s(TEXT.x02460);
    } else {
      s(TEXT.x02461);
    }
    s(TEXT.x02462);
    s(TEXT.x02463);
    afterpee();
    s(TEXT.x02464);
    c("walkhomeX", TEXT.x02465);
  }
}
function hiddencamera() {
  s(TEXT.x02466);
  if (blad > 720) {
    s(TEXT.x02467);
    s(TEXT.x02468);
  } else {
    s(TEXT.x02469);
    s(TEXT.x02470);
  }
  s(TEXT.x02471);
  s(TEXT.x02472);
  afterpee();
  s(TEXT.x02473);
  s(TEXT.x05200);
  c("hiddencamera1", TEXT.x02474);
}
function hiddencamera1() {
  s(TEXT.x02475);
  s(TEXT.x02476);
  s(TEXT.x02477);
  c("gameover", TEXT.x02478);
}
function scenario3() {
  s(TEXT.x02479);
  s(TEXT.x02480);
  if (blad < 600) {
    s(TEXT.x02481);
  } else if (blad < 700) {
    s(TEXT.x02482);
    s(TEXT.x04973);
  } else {
    s(TEXT.x02483);
  }
  if (blad < 700) sitting_desp();
  c("scenario3a", TEXT.x02484);
}
function scenario3a() {
  brotherHome = 1;
  s(TEXT.x02485);
  s(TEXT.x02486);
  c("scenario3b", TEXT.x02487);
}
function scenario3b() {
  s(TEXT.x02488);
  c("sofakiss", TEXT.x02489);
  c("sofaarm", TEXT.x02490);
  if (saturday) {
    c("sofadrink", TEXT.x02491);
  } else {
    c("sofalooask", TEXT.x02492);
  }
}
function sofalooask() {
  s(TEXT.x02493);
  s(TEXT.x02494);
  s(TEXT.x02495);
  getinti(5);
  s(TEXT.x02496);
  blad += 25;
  c("sofaarm", TEXT.x02497);
}
function sofakiss() {
  if (blad < 560) {
    s(TEXT.x02498);
    c("sofasnog", TEXT.x02499);
  } else {
    s(TEXT.x02500);
    s(TEXT.x02501);
    s(TEXT.x04974);
    s(TEXT.x02502);
    s(TEXT.x02503);
    s(TEXT.x02504);
    s(TEXT.x02505);
    if (luckshots >= 1) {
      c("luckytrip10", TEXT.x02506);
      c("sofakiss1", TEXT.x02919);
    } else {
      c("sofakiss1", TEXT.x02717);
    }
  }
}
function sofakiss1() {
  s(TEXT.x02508);
  s(TEXT.x02509);
  s(TEXT.x02510);
  s(TEXT.x02511);
  afterpee();
  c("gameover", TEXT.x02512);
}
var sofaloop = 0;
var sofaDrinkBand = -1;
var sofaDrinkBoost = 0;
var sofaBreastsDone = 0;
var sofaArm2Done = 0;
var sofaLegsStage = 0;
var sofaDressOpened = 0;
var sofaPeeAskedDone = 0;
var sofaOfferLooDone = 0;
var albumdespBand = 0;
var standingBottomDone = 0;
var standingBreastsDone = 0;
var standingLegsDone = 0;
function sofasat() {
  var drinkBand = sofaDrinkBand < 0 ? (blad > 860 ? 2 : blad > 760 ? 1 : 0) : sofaDrinkBand;
  sofaDrinkBand = -1;
  if (drinkBand === 2) {
    if (sofaloop % 2 == 1) {
      s(TEXT.x05201);
    } else {
      s(TEXT.x05202);
    }
    proc += 40;
    cuddleUp();
    c("sofasat1", TEXT.x02515);
  } else if (drinkBand === 1) {
    if (sofaloop % 2 == 1) {
      s(TEXT.x05203);
    } else {
      s(TEXT.x05204);
    }
    proc += 60;
    cuddleUp();
    c("sofasat1", TEXT.x05205);
  } else {
    if (sofaloop % 3 == 1) {
      s(TEXT.x05206);
    } else if (sofaloop % 3 == 2) {
      s(TEXT.x05207);
    } else {
      s(TEXT.x05208);
    }
    proc += 95;
    cuddleUp();
    sitting_desp();
    c("sofasat1", TEXT.x05209);
  }
}
function cuddleUp() {
  if (sofaloop % 3 == 1) {
    s(TEXT.x05210);
  } else if (sofaloop % 3 == 2) {
    s(TEXT.x05211);
  } else {
    s(TEXT.x02514);
  }
}
function sofaChat() {
  if (!saturday) return;
  if (sofaloop >= 5 && sofaDrinkBoost < 1) {
    sofaDrinkBoost = 1;
    s(TEXT.x05212);
    blad += 120;
  }
  if (blad > 860) {
    if (sofaloop % 2 == 1) {
      s(TEXT.x05213);
      s(TEXT.x05214);
    } else {
      s(TEXT.x05215);
      s(TEXT.x05216);
    }
    return;
  }
  var n = sofaloop % 8;
  var topicBit = 1 << n;
  if (sofaTopicsSeen & topicBit) return;
  sofaTopicsSeen |= topicBit;
  if (n == 1) {
    s(TEXT.x05217);
    s(TEXT.x05218);
  } else if (n == 2) {
    s(TEXT.x05219);
    s(TEXT.x05220);
  } else if (n == 3) {
    if (theatretalking) {
      s(TEXT.x05584);
      s(TEXT.x05585);
    } else {
      s(TEXT.x05221);
      s(TEXT.x05222);
    }
  } else if (n == 4) {
    s(TEXT.x05223);
    s(TEXT.x05224);
  } else if (n == 5) {
    s(TEXT.x05225);
    s(TEXT.x05226);
    s(TEXT.x05227);
  } else if (n == 6) {
    if (stampstalking) {
      s(TEXT.x05586);
      s(TEXT.x05587);
    } else {
      s(TEXT.x05228);
      s(TEXT.x05229);
    }
  } else if (n == 7) {
    if (movingtalking) {
      s(TEXT.x05588);
      s(TEXT.x05589);
    } else {
      s(TEXT.x05230);
      s(TEXT.x05231);
    }
  } else {
    s(TEXT.x05232);
    s(TEXT.x05233);
    s(TEXT.x05234);
  }
}
function sofasat1() {
  var repeatEvening = sofaEveningAsked;
  sofaChat();
  if (blad > 860) {
    if (sofaloop % 2 == 1) {
      s(TEXT.x05235);
      if (!sofaEveningAsked) {
        s(TEXT.x05236);
        sofaEveningAsked = 1;
      }
    } else {
      s(TEXT.x05237);
      if (!sofaEveningAsked) {
        s(TEXT.x02517);
        sofaEveningAsked = 1;
      }
    }
    if (!sofaDressOpened) {
      s(TEXT.x05238);
      sofaDressOpened = 1;
    } else {
      if (repeatEvening) {
        s(TEXT.x05590);
      } else {
        s(TEXT.x05239);
      }
    }
  } else if (blad > 760) {
    if (sofaloop % 2 == 1) {
      s(TEXT.x05240);
    } else {
      s(TEXT.x05241);
    }
    if (!sofaEveningAsked) {
      s(TEXT.x05242);
      sofaEveningAsked = 1;
    }
    if (!sofaDressOpened) {
      s(TEXT.x02518);
      sofaDressOpened = 1;
    } else {
      if (repeatEvening) {
        s(TEXT.x05591);
      } else {
        s(TEXT.x05243);
      }
    }
  } else {
    if (sofaloop % 3 == 1) {
      s(TEXT.x05244);
      s(TEXT.x05245);
      if (!sofaDressOpened) {
        s(TEXT.x05246);
        sofaDressOpened = 1;
      } else {
        s(TEXT.x05247);
      }
    } else if (sofaloop % 3 == 2) {
      s(TEXT.x05248);
      s(TEXT.x05249);
      if (!sofaDressOpened) {
        s(TEXT.x05250);
        sofaDressOpened = 1;
      } else {
        s(TEXT.x05251);
      }
    } else {
      s(TEXT.x02516);
      if (!sofaEveningAsked) {
        s(TEXT.x05252);
        sofaEveningAsked = 1;
      }
      if (!sofaDressOpened) {
        s(TEXT.x05253);
        sofaDressOpened = 1;
      } else {
        if (repeatEvening) {
          s(TEXT.x05592);
        } else {
          s(TEXT.x05254);
        }
      }
    }
  }
  if (gopee) {
    s(TEXT.x02519);
    s(TEXT.x05255);
    s(TEXT.x05256);
    if (squat) {
      s(TEXT.x05582);
    } else {
      s(TEXT.x05257);
    }
    s(TEXT.x02521);
    if (squat) {
      s(TEXT.x05583);
    } else {
      s(TEXT.x02522);
    }
    s(TEXT.x05258);
    c("sofatalk", TEXT.x02524);
  } else {
    if (blad > 860) {
      s(TEXT.x05259);
    } else if (blad > 760) {
      s(TEXT.x05260);
    } else {
      if (sofaloop % 3 == 1) {
        s(TEXT.x05261);
      } else if (sofaloop % 3 == 2) {
        s(TEXT.x05262);
      } else {
        s(TEXT.x02525);
      }
    }
    if (blad > 900) {
      emergency();
    } else {
      c("decisions", TEXT.x02526);
    }
  }
}
function sofaarm() {
  s(TEXT.x02527);
  if (blad > 700) {
    if (saturday) {
      s(TEXT.x05263);
    } else {
      s(TEXT.x02528);
    }
  } else {
    s(TEXT.x02529);
  }
  s(TEXT.x02530);
  c("sofadrink", TEXT.x02531);
  c("sofaarm1", TEXT.x02532);
}
function sofadrink() {
  sofaloop++;
  sofaDrinkBand = blad > 860 ? 2 : blad > 760 ? 1 : 0;
  s(TEXT.x02533);
  if (saturday) {
    if (blad > 860) {
      if (sofaloop % 2 == 1) {
        s(TEXT.x05264);
      } else {
        s(TEXT.x05265);
      }
      s(TEXT.x05266);
      c("sofasat", TEXT.x02536);
    } else if (blad > 760) {
      if (sofaloop % 2 == 1) {
        s(TEXT.x05267);
      } else {
        s(TEXT.x05268);
      }
      s(TEXT.x05269);
      c("sofasat", TEXT.x02617);
    } else {
      if (sofaloop % 3 == 1) {
        s(TEXT.x05270);
      } else if (sofaloop % 3 == 2) {
        s(TEXT.x05271);
      } else {
        s(TEXT.x02534);
      }
      if (sofaloop % 3 == 1) {
        s(TEXT.x05272);
      } else if (sofaloop % 3 == 2) {
        s(TEXT.x05273);
      } else {
        s(TEXT.x02535);
      }
      c("sofasat", TEXT.x05274);
    }
  } else {
    s(TEXT.x02537);
    if (inti > 150) {
      s(TEXT.x02538);
      s(TEXT.x02539);
      proc += 100;
    } else {
      s(TEXT.x02540);
      getinti(10);
    }
    c("sofaarm1", TEXT.x02541);
  }
}
function sofaarm1() {
  s(TEXT.x02542);
  if (blad > 660) {
    s(TEXT.x02543);
    s(TEXT.x02544);
    s(TEXT.x02545);
    s(TEXT.x02546);
    s(TEXT.x02547);
    c("sofadesp", TEXT.x02548);
  } else {
    if (saturday) {
      s(TEXT.x05275);
    } else {
      s(TEXT.x02549);
    }
    sitting_desp();
    s(TEXT.x02550);
    s(TEXT.x02551);
    c("sofaarm2", TEXT.x02552);
    c("sofagame", TEXT.x02553);
  }
}
function sofagame() {
  s(TEXT.x02554);
  if (blad < 450) {
    s(TEXT.x02555);
    c("gameover", TEXT.x02556);
  } else {
    s(TEXT.x02557);
    c("sofastamps", TEXT.x02558);
    c("sofatrains", TEXT.x02559);
    c("chessgame", TEXT.x02560);
  }
}
function chessgame() {
  s(TEXT.x02561);
  s(TEXT.x02562);
  c("walkhomeX", TEXT.x02563);
}
function sofaarm2() {
  if (sofaArm2Done) {
    s(TEXT.x05276);
    c("sofasnog2", TEXT.x02569);
    return;
  }
  sofaArm2Done = 1;
  s(TEXT.x02564);
  s(TEXT.x02565);
  c("sofasnog2", TEXT.x05277);
}
function sofadesp() {
  s(TEXT.x02570);
  sitting_desp();
  s(TEXT.x02571);
  s(TEXT.x02572);
  if (saturday) {
    s(TEXT.x05278);
    s(TEXT.x05279);
    s(TEXT.x05280);
  } else {
    s(TEXT.x02573);
    if (thursday) {
      s(TEXT.x02574);
    } else {
      s(TEXT.x02575);
    }
    s(TEXT.x02576);
  }
  if (blad > 900) {
    emergency();
  } else {
    c("sofadesp1", TEXT.x02577);
  }
}
function sofadesp1() {
  s(TEXT.x02578);
  s(TEXT.x02579);
  s(TEXT.x02580);
  s(TEXT.x02581);
  s(TEXT.x02582);
  s(TEXT.x02583);
  if (saturday) {
    s(TEXT.x05281);
    s(TEXT.x05282);
  } else {
    s(TEXT.x02584);
    if (thursday) {
      s(TEXT.x02585);
    } else {
      s(TEXT.x02586);
    }
  }
  s(TEXT.x02587);
  c("sofadesp2", TEXT.x02588);
}
function sofadesp2() {
  s(TEXT.x02589);
  s(TEXT.x02590);
  c("sofatheatre", TEXT.x02591);
  c("sofastamps", TEXT.x02592);
  c("sofatrains", TEXT.x02593);
  c("sofawork", TEXT.x02594);
  c("sofatoilet", TEXT.x02595);
  if (!sofaOfferLooDone) c("givechance1", TEXT.x05063);
  c("excuseme1", TEXT.x_excuseme1_c);
}
function givechance1() {
  sofaOfferLooDone = 1;
  s(TEXT.x05064);
  s(TEXT.x05065);
  s(TEXT.x05066);
  s(TEXT.x05067);
  s(TEXT.x05068);
  adjpoints(5);
  c("sofadesp2", TEXT.x05069);
}
function sofatoilet() {
  s(TEXT.x02596);
  s(TEXT.x02597);
  if (gobehindtoilet) {
    s(TEXT.x02598);
    s(TEXT.x02599);
    s(TEXT.x02600);
    s(TEXT.x04975);
    s(TEXT.x04976);
    c("sofatoilet1", TEXT.x02601);
  } else if (gopee) {
    s(TEXT.x02602);
    s(TEXT.x02603);
    s(TEXT.x02604);
    s(TEXT.x04977);
    s(TEXT.x04978);
    c("sofatoilet1", TEXT.x02605);
  } else {
    s(TEXT.x02606);
    c("toiletgo", TEXT.x02607);
  }
}
function sofatoilet1() {
  if (saturday) {
    s(TEXT.x05283);
  } else {
    s(TEXT.x02608);
  }
  s(TEXT.x02609);
  s(TEXT.x02610);
  s(TEXT.x02611);
  s(TEXT.x02612);
  s(TEXT.x02613);
  s(TEXT.x05284);
  s(TEXT.x02615);
  s(TEXT.x02616);
  c("sofatoilet2", TEXT.x05285);
  c("nicelydesp", TEXT.x02618);
  if (tuesday || thursday) {
    c("stophergoing3", TEXT.x05044);
  }
}
function stophergoing3() {
  s(TEXT.x05045);
  s(TEXT.x05046);
  if (thursday) {
    s(TEXT.x05047);
    s(TEXT.x05048);
  } else {
    s(TEXT.x05049);
    s(TEXT.x05050);
  }
  s(TEXT.x05051);
  c("sofatoilet4", TEXT.x02643);
}
function sofatoilet2() {
  s(TEXT.x02619);
  s(TEXT.x02620);
  proc += 120;
  s(TEXT.x02621);
  if (inti < 150) {
    s(TEXT.x02622);
    s(TEXT.x02623);
    s(TEXT.x02624);
    s(TEXT.x02625);
    afterpee();
    c("gameover", TEXT.x02626);
  } else {
    s(TEXT.x02627);
    s(TEXT.x02628);
    s(TEXT.x02629);
    c("sofatoilet3", TEXT.x02630);
  }
}
function sofatoilet3() {
  s(TEXT.x02631);
  if (blad > 725) {
    s(TEXT.x02632);
    s(TEXT.x02633);
    s(TEXT.x02634);
    s(TEXT.x04979);
    s(TEXT.x02635);
    s(TEXT.x02636);
  } else {
    s(TEXT.x02637);
    s(TEXT.x02638);
    s(TEXT.x02639);
    s(TEXT.x02640);
    s(TEXT.x02641);
  }
  s(TEXT.x02642);
  c("sofatoilet4", TEXT.x05286);
}
function sofatoilet4() {
  s(TEXT.x02644);
  s(TEXT.x02645);
  s(TEXT.x02646);
  s(TEXT.x02647);
  s(TEXT.x02648);
  s(TEXT.x02649);
  s(TEXT.x02650);
  c("nicelydesp1", TEXT.x02651);
  c("loungedesp", TEXT.x02652);
}
function nicelydesp1() {
  s(TEXT.x02653);
  s(TEXT.x02654);
  s(TEXT.x02654_you_story);
  s(TEXT.x02655);
  s(TEXT.x02656);
  s(TEXT.x05287);
  s(TEXT.x05288);
  s(TEXT.x02658);
  s(TEXT.x02659);
  s(TEXT.x02660);
  s(TEXT.x05289);
  c("nicelydesp2", TEXT.x02662);
}
function nicelydesp2() {
  s(TEXT.x02663);
  s(TEXT.x02664);
  s(TEXT.x02665);
  s(TEXT.x02666);
  s(TEXT.x02667);
  s(TEXT.x02668);
  c("nicelydesp3", TEXT.x02669);
}
function nicelydesp3() {
  s(TEXT.x02670);
  s(TEXT.x02671);
  s(TEXT.x02672);
  s(TEXT.x04980);
  s(TEXT.x04981);
  s(TEXT.x02673);
  s(TEXT.x02674);
  s(TEXT.x02675);
  s(TEXT.x02676);
  c("nicelydesp4", TEXT.x02677);
}
function nicelydesp4() {
  s(TEXT.x02678);
  s(TEXT.x02679);
  s(TEXT.x05290);
  s(TEXT.x05291);
  s(TEXT.x02681);
  s(TEXT.x02682);
  s(TEXT.x04982);
  s(TEXT.x04983);
  s(TEXT.x02683);
  s(TEXT.x02684);
  s(TEXT.x02685);
  c("nicelydesp5", TEXT.x02686);
}
function nicelydesp5() {
  s(TEXT.x02687);
  if (inti > 180) {
    s(TEXT.x02688);
    s(TEXT.x02689);
    s(TEXT.x02690);
    s(TEXT.x05292);
    c("nicelydesp6", TEXT.x02692);
  } else {
    s(TEXT.x02693);
    s(TEXT.x02694);
    c("lootogether", TEXT.x02695);
  }
}
function loungedesp() {
  s(TEXT.x02696);
  s(TEXT.x02697);
  s(TEXT.x02698);
  s(TEXT.x02699);
  s(TEXT.x02700);
  if (blad > 800) {
    s(TEXT.x02701);
    s(TEXT.x02702);
    c("loungedesp1", TEXT.x02703);
  } else {
    s(TEXT.x02704);
    s(TEXT.x02704_you_story);
    s(TEXT.x02705);
    s(TEXT.x_lounge_callback_you);
    s(TEXT.x_lounge_callback_diane);
    c("story", TEXT.x02708);
  }
}
function loungedesp1() {
  s(TEXT.x02709);
  afterpee();
  s(TEXT.x02710);
  c("walkhomeX", TEXT.x02711);
}
function excuseme1() {
  if (riesling) {
    s(TEXT.x_excuseme1_a);
    s(TEXT.x05561);
  } else if (merlot) {
    s(TEXT.x05562);
    s(TEXT.x_excuseme1_b);
  } else if (pinot) {
    s(TEXT.x05563);
    s(TEXT.x05564);
  } else if (chardonnay) {
    s(TEXT.x05565);
    s(TEXT.x05566);
  } else if (burgundy) {
    s(TEXT.x05567);
    s(TEXT.x05568);
  } else if (rioja) {
    s(TEXT.x05569);
    s(TEXT.x05570);
  } else {
    s(TEXT.x05571);
    s(TEXT.x05572);
  }
  s(TEXT.x02879);
  if (luckshots >= 1) {
    c("luckytrip12", TEXT.x02716);
    c("toiletgo", TEXT.x05293);
  } else {
    c("toiletgo", TEXT.x02745);
  }
}
function sofatheatre() {
  s(TEXT.x02712);
  s(TEXT.x02713);
  s(TEXT.x02714);
  if (luckshots >= 1) {
    c("luckytrip12", TEXT.x02744);
    c("toiletgo", TEXT.x05294);
  } else {
    c("toiletgo", TEXT.x02852);
  }
}
function sofawork() {
  s(TEXT.x02718);
  s(TEXT.x02719);
  s(TEXT.x02720);
  s(TEXT.x02721);
  s(TEXT.x02722);
  if (luckshots >= 1) c("luckytrip12", TEXT.x02723);
  c("toiletgo", TEXT.x02724);
  c("sofawork1", TEXT.x02725);
}
function sofawork1() {
  s(TEXT.x02726);
  s(TEXT.x02727);
  s(TEXT.x02728);
  s(TEXT.x02729);
  s(TEXT.x02730);
  s(TEXT.x02731);
  s(TEXT.x02732);
  s(TEXT.x02733);
  if (luckshots >= 1) c("luckytrip12", TEXT.x02734);
  c("sofawork2", TEXT.x02735);
}
function sofawork2() {
  s(TEXT.x02736);
  s(TEXT.x02737);
  afterpee();
  c("gameover", TEXT.x02738);
}
function sofastamps() {
  s(TEXT.x02739);
  s(TEXT.x02740);
  if (buycappuccino) {
    s(TEXT.x02741);
    s(TEXT.x02742);
    s(TEXT.x02743);
    if (luckshots >= 1) {
      c("luckytrip18", TEXT.x02851);
      c("toiletgo", TEXT.x05295);
    } else {
      c("toiletgo", TEXT.x02881);
    }
  } else {
    s(TEXT.x02746);
    s(TEXT.x02747);
    s(TEXT.x02748);
    s(TEXT.x02749);
    s(TEXT.x04984);
    c("stampalbum1", TEXT.x02750);
  }
}
function luckytrip18() {
  if (luckshots >= 1) {
    s(TEXT.x02751);
    spendLuckshot();
    s(TEXT.x02752);
    c("luckytrip18a", TEXT.x02753);
  } else {
    cheat();
  }
}
function luckytrip20() {
  if (luckshots >= 1) {
    s(TEXT.x02754);
    spendLuckshot();
    s(TEXT.x02755);
    c("luckytrip20a", TEXT.x02756);
  } else {
    cheat();
  }
}
function cheat() {
  {
    s(TEXT.x02757);
    c("gameover", TEXT.x02758);
  }
}
function luckytrip18a() {
  s(TEXT.x02759);
  if (pannacotta && !brotherHome) {
    s(TEXT.x02760);
    s(TEXT.x02761);
    if (blad > 800) {
      s(TEXT.x02762);
      afterpee();
      c("gameover", TEXT.x02763);
    } else {
      c("scenario5a", TEXT.x02764);
    }
  } else {
    relaxedstampalbum();
  }
}
function luckytrip20a() {
  s(TEXT.x02765);
  if (tiramisu && !brotherHome) {
    s(TEXT.x02766);
    s(TEXT.x02767);
    if (blad > 800) {
      s(TEXT.x02768);
      afterpee();
      c("gameover", TEXT.x02769);
    } else c("scenario5a", TEXT.x02770);
  } else {
    relaxedtrainalbum();
  }
}
function relaxedstampalbum() {
  s(TEXT.x02771);
  s(TEXT.x02772);
  afterpee();
  c("gameover", TEXT.x02773);
}
function relaxedtrainalbum() {
  s(TEXT.x02774);
  s(TEXT.x02775);
  afterpee();
  c("gameover", TEXT.x02776);
}
function luckytrip181() {
  if (luckshots >= 1) {
    s(TEXT.x02777);
    spendLuckshot();
    s(TEXT.x02778);
    c("luckytrip181a", TEXT.x02779);
  } else {
    cheat();
  }
}
function luckytrip181a() {
  s(TEXT.x02780);
  if (buyespresso) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02781);
      c("stampalbum2", TEXT.x02782);
    }
  } else {
    relaxedstampalbum();
  }
}
function luckytrip182() {
  if (luckshots >= 1) {
    s(TEXT.x02783);
    spendLuckshot();
    s(TEXT.x02784);
    c("luckytrip182a", TEXT.x02785);
  } else {
    cheat();
  }
}
function luckytrip182a() {
  s(TEXT.x02786);
  if (buycappuccino) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02787);
      c("stampalbum3", TEXT.x02788);
    }
  } else {
    relaxedstampalbum();
  }
}
function luckytrip183() {
  if (luckshots >= 1) {
    s(TEXT.x02789);
    spendLuckshot();
    s(TEXT.x02790);
    c("luckytrip183a", TEXT.x02791);
  } else {
    cheat();
  }
}
function luckytrip183a() {
  s(TEXT.x02792);
  if (buyfiltercoffee) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02793);
      c("stampalbum4", TEXT.x02794);
    }
  } else {
    relaxedstampalbum();
  }
}
function luckytrip184() {
  if (luckshots >= 1) {
    s(TEXT.x02795);
    spendLuckshot();
    s(TEXT.x02796);
    c("luckytrip184a", TEXT.x02797);
  } else {
    cheat();
  }
}
function luckytrip184a() {
  s(TEXT.x02798);
  if (buyespresso) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02799);
      c("stampalbum5", TEXT.x02800);
    }
  } else {
    relaxedstampalbum();
  }
}
function luckytrip185() {
  if (luckshots >= 1) {
    s(TEXT.x02801);
    spendLuckshot();
    s(TEXT.x02802);
    c("luckytrip185a", TEXT.x02803);
  } else {
    cheat();
  }
}
function luckytrip185a() {
  s(TEXT.x02804);
  if (buycappuccino) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02805);
      c("stampalbum6", TEXT.x02806);
    }
  } else {
    relaxedstampalbum();
  }
}
function luckytrip201() {
  if (luckshots >= 1) {
    s(TEXT.x02807);
    spendLuckshot();
    s(TEXT.x02808);
    c("luckytrip201a", TEXT.x02809);
  } else {
    cheat();
  }
}
function luckytrip201a() {
  s(TEXT.x02810);
  if (buycappuccino) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02811);
      c("sofatrains2", TEXT.x02812);
    }
  } else {
    relaxedtrainalbum();
  }
}
function luckytrip202() {
  if (luckshots >= 1) {
    s(TEXT.x02813);
    spendLuckshot();
    s(TEXT.x02814);
    c("luckytrip202a", TEXT.x02815);
  } else {
    cheat();
  }
}
function luckytrip202a() {
  s(TEXT.x02816);
  if (buyfiltercoffee) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02817);
      c("sofatrains3", TEXT.x02818);
    }
  } else {
    relaxedtrainalbum();
  }
}
function luckytrip203() {
  if (luckshots >= 1) {
    s(TEXT.x02819);
    spendLuckshot();
    s(TEXT.x02820);
    c("luckytrip203a", TEXT.x02821);
  } else {
    cheat();
  }
}
function luckytrip203a() {
  s(TEXT.x02822);
  if (buyespresso) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02823);
      c("sofatrains4", TEXT.x02824);
    }
  } else {
    relaxedtrainalbum();
  }
}
function luckytrip204() {
  if (luckshots >= 1) {
    s(TEXT.x02825);
    spendLuckshot();
    s(TEXT.x02826);
    c("luckytrip204a", TEXT.x02827);
  } else {
    cheat();
  }
}
function luckytrip204a() {
  s(TEXT.x02828);
  if (buycappuccino) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02829);
      c("sofatrains5", TEXT.x02830);
    }
  } else {
    relaxedtrainalbum();
  }
}
function luckytrip205() {
  if (luckshots >= 1) {
    s(TEXT.x02831);
    spendLuckshot();
    s(TEXT.x02832);
    c("luckytrip205a", TEXT.x02833);
  } else {
    cheat();
  }
}
function luckytrip205a() {
  s(TEXT.x02834);
  if (buyfiltercoffee) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02835);
      c("sofatrains6", TEXT.x02836);
    }
  } else {
    relaxedtrainalbum();
  }
}
function luckytrip206() {
  if (luckshots >= 1) {
    s(TEXT.x02837);
    spendLuckshot();
    s(TEXT.x02838);
    c("luckytrip206a", TEXT.x02839);
  } else {
    cheat();
  }
}
function luckytrip206a() {
  s(TEXT.x02840);
  if (buyespresso) {
    rueful();
    if (blad > 725) {
      admission();
    } else {
      s(TEXT.x02841);
      c("sofatrains7", TEXT.x02842);
    }
  } else {
    relaxedtrainalbum();
  }
}
function rueful() {
  s(TEXT.x02843);
  s(TEXT.x02844);
  s(TEXT.x02845);
}
function sofatrains() {
  s(TEXT.x02846);
  s(TEXT.x02847);
  if (buyfiltercoffee) {
    s(TEXT.x02848);
    s(TEXT.x02849);
    s(TEXT.x02850);
    if (luckshots >= 1) {
      c("luckytrip20", TEXT.x02880);
      c("toiletgo", TEXT.x05296);
    } else {
      c("toiletgo", TEXT.x02962);
    }
  } else {
    s(TEXT.x02853);
    s(TEXT.x02854);
    s(TEXT.x02855);
    s(TEXT.x02856);
    s(TEXT.x04985);
    c("sofatrains1", TEXT.x02857);
  }
}
function stampalbum1() {
  s(TEXT.x02858);
  s(TEXT.x02859);
  s(TEXT.x02860);
  s(TEXT.x02861);
  s(TEXT.x02862);
  s(TEXT.x02863);
  albumdesp();
  c("stampalbum1a", TEXT.x02864);
}
function sofatrains1() {
  s(TEXT.x02865);
  s(TEXT.x02866);
  s(TEXT.x02867);
  s(TEXT.x02868);
  s(TEXT.x02869);
  if (tuesday) {
    s(TEXT.x02870);
  } else {
    s(TEXT.x02871);
  }
  albumdesp();
  c("sofatrains1a", TEXT.x02872);
}
function stampalbum1a() {
  s(TEXT.x02873);
  if (tuesday) {
    s(TEXT.x02874);
  } else {
    s(TEXT.x02875);
  }
  s(TEXT.x02876);
  if (pinot) {
    s(TEXT.x02877);
    s(TEXT.x02878);
    s(TEXT.x02960);
    if (luckshots >= 1) {
      c("luckytrip181", TEXT.x02961);
      c("toiletgo", TEXT.x05297);
    } else {
      c("toiletgo", TEXT.x02989);
    }
  } else {
    s(TEXT.x02882);
    s(TEXT.x02883);
    if (blad > 650) {
      s(TEXT.x02885);
      c("givechance", TEXT.x02886);
    }
    c("stampalbum2", TEXT.x02887);
  }
}
function givechance() {
  s(TEXT.x02888);
  s(TEXT.x02889);
  c("givechancea", TEXT.x02890);
  c("givechanceb", TEXT.x02891);
  if (brooch) {
    c("givebrooch", TEXT.x02892);
  } else {
    c("givechancec", TEXT.x02893);
  }
}
function givechancea() {
  s(TEXT.x02894);
  s(TEXT.x02895);
  s(TEXT.x02896);
  afterpee();
  s(TEXT.x02897);
  getinti(-50);
  c("gameover", TEXT.x02898);
}
function givebrooch() {
  if (brooch) {
    s(TEXT.x02899);
    s(TEXT.x02900);
    s(TEXT.x02901);
    s(TEXT.x05298);
    s(TEXT.x02903);
    s(TEXT.x02904);
    s(TEXT.x04986);
    getinti(+15);
    s(TEXT.x02905);
    s(TEXT.x04987);
    c("walkhomeX", TEXT.x02906);
  } else {
    s(TEXT.x02907);
    s(TEXT.x02908);
    s(TEXT.x02909);
    s(TEXT.x02910);
    afterpee();
    c("gameover", TEXT.x02911);
  }
}
function givechanceb() {
  s(TEXT.x02912);
  s(TEXT.x02913);
  s(TEXT.x02914);
  s(TEXT.x02915);
  c("givechanceb1", TEXT.x02916);
}
function givechanceb1() {
  s(TEXT.x02917);
  if (luckshots >= 1) c("luckytrip40", TEXT.x02918);
  c("givechanceb2", TEXT.x05299);
}
function givechanceb2() {
  s(TEXT.x02920);
  afterpee();
  c("gameover", TEXT.x02921);
}
function luckytrip40() {
  if (luckshots >= 1) {
    s(TEXT.x02922);
    spendLuckshot();
    s(TEXT.x02923);
    s(TEXT.x02924);
    s(TEXT.x05300);
    s(TEXT.x02926);
    c("givechanceb3", TEXT.x02927);
  } else {
    s(TEXT.x02928);
    c("gameover", TEXT.x02929);
  }
}
function givechanceb3() {
  s(TEXT.x02930);
  c("gotoilet1", TEXT.x02931);
  c("gokitchen1", TEXT.x02932);
  c("givechanceb4", TEXT.x02933);
}
function givechanceb4() {
  s(TEXT.x02934);
  s(TEXT.x02935);
  s(TEXT.x02936);
  s(TEXT.x02937);
  afterpee();
  c("gameover", TEXT.x02938);
}
function gokitchen1() {
  s(TEXT.x02939);
  s(TEXT.x02940);
  s(TEXT.x02941);
  s(TEXT.x02942);
  c("walkhomeX", TEXT.x02943);
}
function gotoilet1() {
  s(TEXT.x02944);
  s(TEXT.x02945);
  s(TEXT.x05301);
  s(TEXT.x02947);
  afterpee();
  c("walkhomeX", TEXT.x02948);
}
function givechancec() {
  s(TEXT.x02949);
  s(TEXT.x02950);
  getinti(15);
  s(TEXT.x02951);
  s(TEXT.x02952);
  afterpee();
  c("walkhomeX", TEXT.x02953);
}
function sofatrains1a() {
  s(TEXT.x02954);
  if (tuesday) {
    s(TEXT.x02955);
  } else {
    s(TEXT.x02956);
  }
  s(TEXT.x02957);
  if (rioja) {
    s(TEXT.x02958);
    s(TEXT.x02959);
    s(TEXT.x02987);
    if (luckshots >= 1) {
      c("luckytrip201", TEXT.x02988);
      c("toiletgo", TEXT.x05302);
    } else {
      c("toiletgo", TEXT.x03003);
    }
  } else {
    s(TEXT.x02963);
    s(TEXT.x02964);
    if (blad > 650) {
      s(TEXT.x02966);
      c("givechance", TEXT.x02967);
    }
    c("sofatrains2", TEXT.x02968);
  }
}
function stampalbum2() {
  s(TEXT.x02969);
  if (saturday) {
    s(TEXT.x05303);
  } else {
    s(TEXT.x02970);
  }
  s(TEXT.x02971);
  if (saturday) {
    s(TEXT.x05304);
  } else {
    s(TEXT.x02972);
  }
  s(TEXT.x02973);
  albumdesp();
  c("stampalbum2a", TEXT.x02974);
}
function sofatrains2() {
  s(TEXT.x02975);
  s(TEXT.x02976);
  if (tuesday) {
    s(TEXT.x02977);
  } else if (saturday) {
    s(TEXT.x05305);
  } else {
    s(TEXT.x02978);
  }
  if (saturday) {
    s(TEXT.x05306);
  } else {
    s(TEXT.x02979);
  }
  s(TEXT.x02980);
  albumdesp();
  c("sofatrains2a", TEXT.x02981);
}
function stampalbum2a() {
  if (tuesday) {
    s(TEXT.x02982);
  } else if (saturday) {
    s(TEXT.x05307);
  } else {
    s(TEXT.x02983);
  }
  s(TEXT.x05308);
  if (chardonnay) {
    s(TEXT.x02985);
    s(TEXT.x05309);
    s(TEXT.x03001);
    if (luckshots >= 1) {
      c("luckytrip182", TEXT.x03002);
      c("toiletgo", TEXT.x05310);
    } else {
      c("toiletgo", TEXT.x03030);
    }
  } else {
    s(TEXT.x05311);
    s(TEXT.x05312);
    if (blad > 650) {
      s(TEXT.x02993);
      c("givechance", TEXT.x02994);
    }
    c("stampalbum3", TEXT.x02995);
  }
}
function sofatrains2a() {
  if (tuesday) {
    s(TEXT.x02996);
  } else if (saturday) {
    s(TEXT.x05313);
  } else {
    s(TEXT.x02997);
  }
  s(TEXT.x05314);
  if (burgundy) {
    s(TEXT.x02999);
    s(TEXT.x05315);
    s(TEXT.x03028);
    if (luckshots >= 1) {
      c("luckytrip202", TEXT.x03029);
      c("toiletgo", TEXT.x05316);
    } else {
      c("toiletgo", TEXT.x03042);
    }
  } else {
    s(TEXT.x05317);
    s(TEXT.x05318);
    if (blad > 650) {
      s(TEXT.x03007);
      c("givechance", TEXT.x03008);
    }
    c("sofatrains3", TEXT.x03009);
  }
}
function stampalbum3() {
  s(TEXT.x03010);
  s(TEXT.x03011);
  if (blad > 750) {
    s(TEXT.x03012);
  } else {
    s(TEXT.x03013);
  }
  s(TEXT.x03014);
  s(TEXT.x03015);
  albumdesp();
  c("stampalbum3a", TEXT.x03016);
}
function sofatrains3() {
  s(TEXT.x03017);
  if (saturday) {
    s(TEXT.x05319);
  } else {
    s(TEXT.x03018);
  }
  s(TEXT.x03019);
  if (saturday) {
    s(TEXT.x05320);
  } else {
    s(TEXT.x03020);
  }
  if (blad > 740) {
    s(TEXT.x03021);
  } else {
    s(TEXT.x03022);
  }
  s(TEXT.x03023);
  albumdesp();
  c("sofatrains3a", TEXT.x03024);
}
function stampalbum3a() {
  s(TEXT.x05321);
  if (merlot) {
    s(TEXT.x03026);
    s(TEXT.x03027);
    s(TEXT.x03040);
    if (luckshots >= 1) {
      c("luckytrip183", TEXT.x03041);
      c("toiletgo", TEXT.x05322);
    } else {
      c("toiletgo", TEXT.x03078);
    }
  } else {
    s(TEXT.x05323);
    s(TEXT.x05324);
    if (blad > 650) {
      s(TEXT.x03034);
      c("givechance", TEXT.x03035);
    }
    c("stampalbum4", TEXT.x03036);
  }
}
function sofatrains3a() {
  s(TEXT.x05325);
  if (chardonnay) {
    s(TEXT.x03038);
    s(TEXT.x03039);
    s(TEXT.x03076);
    if (luckshots >= 1) {
      c("luckytrip203", TEXT.x03077);
      c("toiletgo", TEXT.x05326);
    } else {
      c("toiletgo", TEXT.x03095);
    }
  } else {
    s(TEXT.x05327);
    s(TEXT.x05328);
    if (blad > 650) {
      s(TEXT.x03046);
      c("givechance", TEXT.x03047);
    }
    c("sofatrains4", TEXT.x03048);
  }
}
function stampalbum4() {
  s(TEXT.x03049);
  if (blad > 750) {
    s(TEXT.x03050);
    s(TEXT.x03051);
    s(TEXT.x03052);
    if (points < 19) {
      s(TEXT.x05329);
    } else {
      s(TEXT.x03054);
    }
  } else {
    s(TEXT.x03055);
    s(TEXT.x03056);
    s(TEXT.x03057);
  }
  s(TEXT.x03058);
  albumdesp();
  c("stampalbum4a", TEXT.x03059);
}
function sofatrains4() {
  s(TEXT.x03060);
  if (blad > 740) {
    s(TEXT.x03061);
  } else {
    s(TEXT.x03062);
  }
  s(TEXT.x03063);
  s(TEXT.x03064);
  s(TEXT.x03065);
  s(TEXT.x03066);
  albumdesp();
  c("sofatrains4a", TEXT.x03067);
}
function stampalbum4a() {
  if (blad > 900) {
    emergency();
  } else {
    if (saturday) {
      s(TEXT.x05330);
    } else {
      s(TEXT.x03068);
    }
    if (tuesday) {
      s(TEXT.x03069);
    } else if (saturday) {
      s(TEXT.x05331);
    } else {
      s(TEXT.x03071);
      s(TEXT.x03072);
    }
    s(TEXT.x05332);
    if (burgundy) {
      s(TEXT.x03074);
      s(TEXT.x03075);
      s(TEXT.x03093);
      if (luckshots >= 1) {
        c("luckytrip184", TEXT.x03094);
        c("toiletgo", TEXT.x05333);
      } else {
        c("toiletgo", TEXT.x03129);
      }
    } else {
      s(TEXT.x05334);
      s(TEXT.x05335);
      if (blad > 700) {
        s(TEXT.x03082);
        c("givechance", TEXT.x03083);
      }
      c("stampalbum5", TEXT.x03084);
    }
  }
}
function sofatrains4a() {
  if (blad > 900) {
    emergency();
  } else {
    if (saturday) {
      s(TEXT.x05336);
    } else {
      s(TEXT.x03085);
    }
    if (tuesday) {
      s(TEXT.x03086);
    } else if (saturday) {
      s(TEXT.x05337);
    } else {
      s(TEXT.x03088);
      s(TEXT.x03089);
    }
    s(TEXT.x05338);
    if (pinot) {
      s(TEXT.x03091);
      s(TEXT.x03092);
      s(TEXT.x03127);
      if (luckshots >= 1) {
        c("luckytrip204", TEXT.x03128);
        c("toiletgo", TEXT.x05339);
      } else {
        c("toiletgo", TEXT.x03142);
      }
    } else {
      s(TEXT.x05340);
      s(TEXT.x05341);
      if (blad > 700) {
        s(TEXT.x03099);
        c("givechance", TEXT.x03100);
      }
      c("sofatrains5", TEXT.x03101);
    }
  }
}
function stampalbum5() {
  s(TEXT.x03102);
  if (blad > 725) {
    s(TEXT.x03103);
    s(TEXT.x03104);
  } else {
    s(TEXT.x03105);
  }
  s(TEXT.x03106);
  if (tuesday) {
    s(TEXT.x03107);
  } else if (thursday) {
    s(TEXT.x03108);
  } else {
    s(TEXT.x03109);
  }
  s(TEXT.x03110);
  albumdesp();
  s(TEXT.x03111);
  c("stampalbum5a", TEXT.x03112);
}
function sofatrains5() {
  s(TEXT.x03113);
  s(TEXT.x03114);
  if (blad > 750) {
    s(TEXT.x03115);
  } else {
    s(TEXT.x03116);
  }
  s(TEXT.x03117);
  s(TEXT.x03118);
  if (tuesday) {
    s(TEXT.x03119);
  } else if (saturday) {
    s(TEXT.x05342);
  } else {
    s(TEXT.x03120);
  }
  s(TEXT.x03121);
  albumdesp();
  c("sofatrains5a", TEXT.x03122);
}
function stampalbum5a() {
  if (saturday) {
    s(TEXT.x03123);
  } else {
    s(TEXT.x05343);
  }
  s(TEXT.x05344);
  if (riesling) {
    s(TEXT.x03125);
    s(TEXT.x03126);
    s(TEXT.x03140);
    if (luckshots >= 1) {
      c("luckytrip185", TEXT.x03141);
      c("toiletgo", TEXT.x05345);
    } else {
      c("toiletgo", TEXT.x03165);
    }
  } else {
    s(TEXT.x05346);
    s(TEXT.x05347);
    if (blad > 700) {
      s(TEXT.x03133);
      c("givechance", TEXT.x03134);
    }
    c("stampalbum6", TEXT.x03135);
  }
}
function sofatrains5a() {
  if (saturday) {
    s(TEXT.x03136);
  } else {
    s(TEXT.x05348);
  }
  s(TEXT.x05349);
  if (merlot) {
    s(TEXT.x03138);
    s(TEXT.x03139);
    s(TEXT.x05350);
    if (luckshots >= 1) {
      c("luckytrip205", TEXT.x03164);
      c("toiletgo", TEXT.x05351);
    } else {
      c("toiletgo", TEXT.x05352);
    }
  } else {
    s(TEXT.x05353);
    s(TEXT.x05354);
    if (blad > 700) {
      s(TEXT.x03146);
      c("givechance", TEXT.x03147);
    }
    c("sofatrains6", TEXT.x03148);
  }
}
function stampalbum6() {
  if (blad > 900) {
    emergency();
  } else {
    s(TEXT.x03149);
    s(TEXT.x03150);
    if (blad > 800) {
      s(TEXT.x03151);
      s(TEXT.x03152);
    } else {
      s(TEXT.x03153);
    }
    s(TEXT.x03154);
    albumdesp();
    c("stampalbum6a", TEXT.x03155);
  }
}
function sofatrains6() {
  if (blad > 900) {
    emergency();
  } else {
    s(TEXT.x03156);
    s(TEXT.x03157);
    if (blad > 800) {
      s(TEXT.x03158);
      s(TEXT.x03159);
    } else {
      s(TEXT.x03160);
    }
    s(TEXT.x03161);
    albumdesp();
    if (rioja) {
      s(TEXT.x03162);
      s(TEXT.x03163);
      if (luckshots >= 1) {
        c("luckytrip206", TEXT.x05355);
        c("toiletgo", TEXT.x05356);
      } else {
        c("toiletgo", TEXT.x05357);
      }
    } else {
      c("sofatrains7", TEXT.x03166);
    }
  }
}
function stampalbum6a() {
  if (blad > 900) {
    emergency();
  } else {
    s(TEXT.x05358);
    s(TEXT.x03168);
    if (tuesday) {
      s(TEXT.x03169);
    } else if (thursday) {
      s(TEXT.x03170);
    } else {
      s(TEXT.x03171);
    }
    s(TEXT.x03172);
    s(TEXT.x03173);
    s(TEXT.x03174);
    {
      s(TEXT.x03176);
      c("givechance", TEXT.x03177);
    }
    c("stampalbum7", TEXT.x03178);
  }
}
function stampalbum7() {
  s(TEXT.x03179);
  s(TEXT.x03180);
  s(TEXT.x03181);
  if (brooch) {
    s(TEXT.x03182);
    s(TEXT.x03183);
    s(TEXT.x03184);
    s(TEXT.x03185);
    s(TEXT.x04988);
    getinti(+15);
    s(TEXT.x03186);
    s(TEXT.x04989);
    c("walkhomeX", TEXT.x03187);
  } else {
    s(TEXT.x03188);
    s(TEXT.x03189);
    s(TEXT.x03190);
    c("stampalbum8", TEXT.x03191);
  }
}
function sofatrains7() {
  s(TEXT.x03192);
  if (tuesday) {
    s(TEXT.x03193);
  } else if (saturday) {
    s(TEXT.x05359);
  } else {
    s(TEXT.x03194);
  }
  s(TEXT.x03195);
  s(TEXT.x03196);
  s(TEXT.x03197);
  s(TEXT.x05360);
  s(TEXT.x03199);
  albumdesp();
  c("stampalbum7", TEXT.x03200);
}
function stampalbum8() {
  s(TEXT.x03201);
  if (saturday) {
    s(TEXT.x05361);
  } else {
    s(TEXT.x03202);
  }
  s(TEXT.x03203);
  if (blad > 850) {
    s(TEXT.x03204);
    afterpee();
    c("dampness", TEXT.x03205);
  } else {
    s(TEXT.x03206);
    s(TEXT.x03207);
    afterpee();
    s(TEXT.x03208);
    c("gameover", TEXT.x03209);
  }
}
function dampness() {
  s(TEXT.x03210);
  s(TEXT.x03211);
  s(TEXT.x03212);
  s(TEXT.x03213);
  c("breastsz", TEXT.x03214);
  c("legsz", TEXT.x03215);
}
function breastsz() {
  s(TEXT.x03216);
  s(TEXT.x03217);
  c("gameover", TEXT.x03218);
}
function legsz() {
  s(TEXT.x03219);
  if (saturday) {
    s(TEXT.x05362);
  } else {
    s(TEXT.x03220);
  }
  s(TEXT.x03221);
  if (thursday) {
    s(TEXT.x03222);
  } else {
    s(TEXT.x03223);
  }
  if (saturday) {
    s(TEXT.x05363);
  } else {
    s(TEXT.x03224);
  }
  s(TEXT.x03225);
  c("legsz1", TEXT.x03226);
}
function legsz1() {
  if (thursday) {
    s(TEXT.x03227);
  } else if (tuesday) {
    s(TEXT.x03228);
  } else {
    s(TEXT.x03229);
  }
  s(TEXT.x03230);
  s(TEXT.x03231);
  s(TEXT.x05364);
  s(TEXT.x05365);
  s(TEXT.x03233);
  c("legsz2", TEXT.x03234);
}
function legsz2() {
  if (saturday) {
    s(TEXT.x05366);
  } else {
    s(TEXT.x03235);
  }
  s(TEXT.x03236);
  s(TEXT.x05367);
  s(TEXT.x03238);
  s(TEXT.x03239);
  s(TEXT.x03240);
  c("legsz3", TEXT.x03241);
}
function legsz3() {
  s(TEXT.x03242);
  s(TEXT.x03243);
  s(TEXT.x03244);
  s(TEXT.x03245);
}
function luckytrip12() {
  if (luckshots >= 1) {
    s(TEXT.x03246);
    s(TEXT.x03247);
    spendLuckshot();
    c("luckytrip12a", TEXT.x03248);
  } else {
    s(TEXT.x03249);
    c("gameover", TEXT.x03250);
  }
}
function luckytrip12a() {
  s(TEXT.x03251);
  if (triedbathroom) {
    s(TEXT.x03252);
    c("luckytrip13", TEXT.x03253);
  } else {
    if (blad > 700) {
      s(TEXT.x03254);
    } else {
      s(TEXT.x03255);
    }
    s(TEXT.x03256);
    if (tuesday) {
      c("luckytrip12tues", TEXT.x03257);
    } else if (thursday) {
      c("luckytrip12thurs", TEXT.x03258);
    } else {
      c("luckytrip12sat", TEXT.x03259);
    }
  }
}
function luckytrip12tues() {
  if (buyespresso) {
    s(TEXT.x03260);
    s(TEXT.x03261);
    afterpee();
    c("gameover", TEXT.x03262);
  } else {
    s(TEXT.x03263);
    triedbathroom = 1;
    s(TEXT.x03264);
    s(TEXT.x03265);
    s(TEXT.x03266);
    if (traintalking) {
      s(TEXT.x03266a);
      c("sofatrains", TEXT.x03266b);
      c("walkhomeinsist", TEXT.x03266c);
    } else {
      s(TEXT.x03267);
      c("walkhomeX", TEXT.x03268);
    }
  }
}
function luckytrip12thurs() {
  if (buycappuccino) {
    s(TEXT.x03269);
    s(TEXT.x03270);
    afterpee();
    c("gameover", TEXT.x03271);
  } else {
    s(TEXT.x03272);
    triedbathroom = 1;
    s(TEXT.x03273);
    s(TEXT.x03274);
    s(TEXT.x03275);
    if (traintalking) {
      s(TEXT.x05368);
      c("sofatrains", TEXT.x05369);
      c("walkhomeinsist", TEXT.x05370);
    } else {
      s(TEXT.x03276);
      c("walkhomeX", TEXT.x03277);
    }
  }
}
function luckytrip12sat() {
  if (buyfiltercoffee) {
    s(TEXT.x03278);
    s(TEXT.x03279);
    afterpee();
    c("gameover", TEXT.x03280);
  } else {
    s(TEXT.x03281);
    triedbathroom = 1;
    s(TEXT.x03282);
    s(TEXT.x03283);
    s(TEXT.x03284);
    if (traintalking) {
      s(TEXT.x05371);
      c("sofatrains", TEXT.x05372);
      c("walkhomeinsist", TEXT.x05373);
    } else {
      s(TEXT.x03285);
      c("walkhomeX", TEXT.x03286);
    }
  }
}
function walkhomeinsist() {
  s(TEXT.x03292);
  c("walkhomeX", TEXT.x03293);
}
function luckytrip13() {
  s(TEXT.x03287);
  if (nicecoffee) {
    s(TEXT.x03288);
    triedbathroom = 1;
    s(TEXT.x03289);
    s(TEXT.x03290);
    s(TEXT.x03291);
    s(TEXT.x05374);
    c("walkhomeX", TEXT.x05375);
  } else {
    s(TEXT.x03294);
    s(TEXT.x03295);
    afterpee();
    c("gameover", TEXT.x03296);
  }
}
function toiletgo() {
  s(TEXT.x03297);
  s(TEXT.x03298);
  afterpee();
  c("gameover", TEXT.x03299);
}
function luckytrip10() {
  if (luckshots >= 1) {
    s(TEXT.x03300);
    spendLuckshot();
    if (blad > 700) {
      s(TEXT.x03301);
    } else {
      s(TEXT.x03302);
    }
    s(TEXT.x03303);
    c("luckytrip10a", TEXT.x03304);
  } else {
    s(TEXT.x03305);
    c("gameover", TEXT.x03306);
  }
}
function luckytrip10a() {
  s(TEXT.x03307);
  s(TEXT.x03308);
  s(TEXT.x03309);
  s(TEXT.x03310);
  s(TEXT.x03311);
  c("luckytrip10b", TEXT.x03312);
}
function luckytrip10b() {
  s(TEXT.x03313);
  s(TEXT.x03355);
  c("kiss1", TEXT.x03315);
  if (!standingBottomDone) c("bottom1", TEXT.x03316);
  if (!standingBreastsDone) c("breasts1", TEXT.x03317);
  c("luckytrip10c", TEXT.x03318);
  if (standingBottomDone && standingBreastsDone) {
    s(TEXT.x02568a);
    blad += 10;
    getinti(2);
    c("sofasnog", TEXT.x03337);
    c("walkhomeX", TEXT.x03549);
  }
}
function luckytrip10c() {
  s(TEXT.x03319);
  s(TEXT.x03320);
  s(TEXT.x03321);
  s(TEXT.x03322);
  if (!standingBottomDone) c("bottom1", TEXT.x03323);
  else if (!standingBreastsDone) c("breasts1", TEXT.x02566);
  else {
    s(TEXT.x02568b);
    blad += 8;
    getinti(1);
    c("sofasnog", TEXT.x03537);
    c("walkhomeX", TEXT.x03999);
  }
}
function kiss1() {
  s(TEXT.x03324);
  s(TEXT.x03325);
  s(TEXT.x03326);
  s(TEXT.x03327);
  if (inti > 160) {
    s(TEXT.x03328);
    c("walkhomeX", TEXT.x03329);
  } else {
    s(TEXT.x03330);
    c("gameover", TEXT.x03331);
  }
}
function breasts1() {
  standingBreastsDone = 1;
  s(TEXT.x03332);
  s(TEXT.x03333);
  s(TEXT.x03334);
  getinti(6);
  if (blad > 700) {
    s(TEXT.x03335);
    s(TEXT.x05376);
    c("sofasnog", TEXT.x03542);
  } else {
    s(TEXT.x03338);
    getinti(2);
    c("breasts2", TEXT.x03339);
  }
}
function breasts2() {
  if (saturday) {
    s(TEXT.x03340);
  } else {
    s(TEXT.x03341);
  }
  if (inti < 120) {
    s(TEXT.x03342);
    s(TEXT.x03343);
    c("walkhomeX", TEXT.x03344);
  } else {
    s(TEXT.x03345);
    s(TEXT.x03346);
    c("bottom2", TEXT.x03347);
  }
}
function bottom1() {
  standingBottomDone = 1;
  s(TEXT.x03348);
  if (inti < 130) {
    s(TEXT.x03349);
    s(TEXT.x03350);
    c("walkhomeX", TEXT.x03351);
  } else {
    s(TEXT.x03352);
    if (tuesday) {
      s(TEXT.x03353);
    } else {
      s(TEXT.x03354);
    }
    s(TEXT.x03584);
    if (!standingLegsDone) c("bottom1a", TEXT.x03356);
    if (!standingBreastsDone) c("breasts1b", TEXT.x03357);
    c("kissher", TEXT.x03358);
  }
}
function bottom1a() {
  standingLegsDone = 1;
  s(TEXT.x03359);
  if (thursday) {
    s(TEXT.x03360);
    s(TEXT.x03361);
    s(TEXT.x03362);
    s(TEXT.x03363);
    s(TEXT.x03364);
    c("bottomthurs", TEXT.x03365);
  } else {
    s(TEXT.x03366);
    c("suddenend", TEXT.x03367);
  }
}
function bottomthurs() {
  s(TEXT.x03368);
  if (blad < 650) {
    s(TEXT.x03369);
  } else {
    s(TEXT.x03370);
  }
  s(TEXT.x03371);
  c("skirtremove1", TEXT.x03372);
  c("blouseremove", TEXT.x03373);
  c("walkhomeX", TEXT.x03374);
}
function skirtremove1() {
  s(TEXT.x03375);
  s(TEXT.x03376);
  s(TEXT.x03377);
  s(TEXT.x03378);
  s(TEXT.x03379);
  s(TEXT.x03380);
  s(TEXT.x03381);
  c("skirtremove1a", TEXT.x03382);
}
function skirtremove1a() {
  s(TEXT.x03383);
  s(TEXT.x03384);
  if (inti < 149) {
    s(TEXT.x03385);
    c("skirton", TEXT.x03386);
  } else {
    s(TEXT.x03387);
    s(TEXT.x03388);
    c("skirtremove1b", TEXT.x03389);
  }
}
function skirtremove1b() {
  s(TEXT.x03390);
  if (blad > 750) {
    s(TEXT.x03391);
    s(TEXT.x03392);
    s(TEXT.x03393);
    s(TEXT.x03394);
    s(TEXT.x03395);
    s(TEXT.x03396);
  } else {
    s(TEXT.x03397);
    s(TEXT.x03398);
  }
  c("skirtremove1c", TEXT.x03399);
}
function skirtremove1c() {
  s(TEXT.x03400);
  if (blad > 750) {
    s(TEXT.x03401);
    s(TEXT.x03402);
    s(TEXT.x03403);
    s(TEXT.x03404);
    s(TEXT.x03405);
  } else {
    s(TEXT.x03406);
    s(TEXT.x03407);
  }
  s(TEXT.x03408);
  c("skirtremove1d", TEXT.x03409);
}
function skirtremove1d() {
  s(TEXT.x03410);
  s(TEXT.x03411);
  c("skirtgive", TEXT.x03412);
  c("skirtremove1e", TEXT.x03413);
}
function skirtremove1e() {
  s(TEXT.x03414);
  s(TEXT.x03415);
  s(TEXT.x03416);
  s(TEXT.x03417);
  if (blad > 750) {
    s(TEXT.x03418);
    s(TEXT.x03419);
  } else {
    s(TEXT.x03420);
    s(TEXT.x03421);
  }
  s(TEXT.x03422);
  c("skirtremove1f", TEXT.x03423);
}
function skirtremove1f() {
  s(TEXT.x03424);
  if (blad > 750) {
    s(TEXT.x03425);
    s(TEXT.x03426);
    s(TEXT.x03427);
  } else {
    s(TEXT.x03428);
    s(TEXT.x03429);
  }
  s(TEXT.x03430);
  c("skirtremove1g", TEXT.x03431);
}
function skirtremove1g() {
  s(TEXT.x03432);
  c("skirtgive", TEXT.x03433);
  c("skirtdeal", TEXT.x03434);
  c("skirtremove1h", TEXT.x03435);
}
function skirtgive() {
  s(TEXT.x03436);
  if (blad > 800) {
    s(TEXT.x03437);
    s(TEXT.x03438);
  } else {
    s(TEXT.x03439);
  }
  s(TEXT.x03440);
  s(TEXT.x03441);
  s(TEXT.x03442);
  s(TEXT.x03443);
  afterpee();
  c("gameover", TEXT.x03444);
}
function skirton() {
  s(TEXT.x03445);
  if (blad > 800) {
    s(TEXT.x03446);
    s(TEXT.x03447);
  } else {
    s(TEXT.x03448);
  }
  s(TEXT.x03449);
  s(TEXT.x03450);
  s(TEXT.x03451);
  s(TEXT.x03452);
  afterpee();
  c("gameover", TEXT.x03453);
}
function skirtdeal() {
  s(TEXT.x03454);
  if (blad > 750) {
    s(TEXT.x03455);
  } else {
    s(TEXT.x03456);
  }
  s(TEXT.x03457);
  s(TEXT.x03458);
  s(TEXT.x03459);
  s(TEXT.x03460);
  s(TEXT.x03461);
  s(TEXT.x03462);
  c("skirtdeal1", TEXT.x03463);
}
function skirtdeal1() {
  if (blad > 800) {
    s(TEXT.x03464);
    s(TEXT.x03465);
  } else {
    s(TEXT.x03466);
  }
  c("skirtdeal2", TEXT.x03467);
}
function skirtdeal2() {
  s(TEXT.x03468);
  s(TEXT.x03469);
  s(TEXT.x03470);
  s(TEXT.x03471);
  s(TEXT.x03472);
  c("gobathroom", TEXT.x03473);
}
function gobathroom() {
  if (saturday) {
    s(TEXT.x05573);
  } else {
    s(TEXT.x03474);
  }
  s(TEXT.x03475);
  if (blad < 675) {
    s(TEXT.x03476);
    s(TEXT.x03477);
    s(TEXT.x03478);
    if (saturday) {
      s(TEXT.x05574);
    } else {
      s(TEXT.x03479);
    }
    c("gobathroom1", TEXT.x03480);
  } else {
    if (saturday) {
      s(TEXT.x05575);
    } else {
      s(TEXT.x03481);
    }
    s(TEXT.x03482);
    if (saturday) {
      s(TEXT.x05576);
    } else {
      s(TEXT.x03483);
    }
    c("gobathroom1", TEXT.x03484);
  }
}
function gobathroom1() {
  s(TEXT.x03485);
  if (inti > 157) {
    s(TEXT.x03486);
    if (saturday) {
      s(TEXT.x05577);
    } else {
      s(TEXT.x03487);
    }
    s(TEXT.x03488);
    blad = 0;
    s(TEXT.x03489);
    s(TEXT.x03490);
    if (saturday) {
      s(TEXT.x05578);
    } else {
      s(TEXT.x04990);
    }
    if (saturday) {
      s(TEXT.x05579);
    } else {
      s(TEXT.x03491);
    }
    c("gobathroom2", TEXT.x03492);
  } else {
    s(TEXT.x03493);
    blad = 0;
    s(TEXT.x05377);
    if (saturday) {
      s(TEXT.x05580);
    } else {
      s(TEXT.x03495);
    }
    c("gobathroomx", TEXT.x03496);
  }
}
function gobathroom2() {
  s(TEXT.x03497);
  s(TEXT.x03498);
  s(TEXT.x03499);
  s(TEXT.x03500);
  s(TEXT.x03501);
  s(TEXT.x03502);
  c("gobathroom3", TEXT.x03503);
}
function gobathroom3() {
  s(TEXT.x03504);
  s(TEXT.x03505);
  s(TEXT.x03506);
  s(TEXT.x03507);
}
function gobathroomx() {
  if (saturday) {
    s(TEXT.x05581);
  } else {
    s(TEXT.x03508);
  }
  s(TEXT.x03509);
  s(TEXT.x03510);
  s(TEXT.x03511);
  s(TEXT.x03512);
  s(TEXT.x03513);
  c("gameover", TEXT.x03514);
}
function skirtremove1h() {
  s(TEXT.x03515);
  s(TEXT.x03516);
  s(TEXT.x03517);
  blad = 0;
  s(TEXT.x03518);
  s(TEXT.x03519);
  c("gameover", TEXT.x03520);
}
function blouseremove() {
  s(TEXT.x03521);
  s(TEXT.x03522);
  s(TEXT.x03523);
  s(TEXT.x03524);
  s(TEXT.x03525);
  c("blouseremove1", TEXT.x03526);
}
function blouseremove1() {
  s(TEXT.x03527);
  s(TEXT.x03528);
  s(TEXT.x03529);
  c("gameover", TEXT.x03530);
}
function kissher() {
  s(TEXT.x03531);
  getinti(-5);
  if (blad > 750) {
    s(TEXT.x03532);
    s(TEXT.x03533);
  } else {
    s(TEXT.x03534);
  }
  if (!standingBreastsDone) c("breasts1b", TEXT.x05378);
  else {
    c("sofasnog", TEXT.x05379);
    c("walkhomeX", TEXT.x05380);
  }
}
function breasts1b() {
  standingBreastsDone = 1;
  s(TEXT.x05381);
  c("sofasnog", TEXT.x05382);
}
function bottom2() {
  s(TEXT.x03538);
  s(TEXT.x03539);
  getinti(10);
  if (blad > 700) {
    s(TEXT.x03540);
    s(TEXT.x05383);
    c("sofasnog", TEXT.x05384);
  } else {
    s(TEXT.x03543);
    getinti(2);
    c("bottom2a", TEXT.x03544);
  }
}
function bottom2a() {
  s(TEXT.x03545);
  c("sofasnog", TEXT.x03546);
  if (!sofaBreastsDone) c("sofabreasts", TEXT.x03547);
  if (sofaLegsStage < 2) c("sofalegs", TEXT.x03548);
  if (!sofaPeeAskedDone) c("sofapee", TEXT.x02567);
  c("walkhomeX", TEXT.x05385);
}
function sofasnog() {
  s(TEXT.x03550);
  if (blad > 700) {
    s(TEXT.x03551);
  } else {
    s(TEXT.x03552);
  }
  c("sofasnog1", TEXT.x03553);
}
function sofasnog1() {
  s(TEXT.x03554);
  if (inti < 130) {
    s(TEXT.x03555);
    s(TEXT.x03556);
    c("walkhomeX", TEXT.x03557);
  } else {
    s(TEXT.x03558);
    if (saturday) {
      s(TEXT.x03559);
      s(TEXT.x03560);
      c("sofasat", TEXT.x03561);
    } else c("sofasnog2", TEXT.x03562);
  }
}
function walkhomeX() {
  if (blad < 300) {
    walkhomeXa();
    return;
  }
  s(TEXT.x03563);
  s(TEXT.x03564);
  s(TEXT.x03565);
  s(TEXT.x03566);
  c("bathroomfree", TEXT.x03567);
  c("walkhomeXa", TEXT.x03568);
}
function bathroomfree() {
  s(TEXT.x03569);
  if (blad < 700) {
    s(TEXT.x03570);
    c("walkhomeXa", TEXT.x03571);
  } else {
    s(TEXT.x03572);
    s(TEXT.x03573);
    afterpee();
    c("gameover", TEXT.x03574);
  }
}
function walkhomeXa() {
  s(TEXT.x03575);
  s(TEXT.x03576);
  if (blad > 580 && blad <= 725) {
    s(TEXT.x03577);
  } else if (blad > 725 && blad <= 830) {
    s(TEXT.x03578);
    if (points < 15) {
      s(TEXT.x03579);
      s(TEXT.x03580);
      afterpee();
    } else {
      s(TEXT.x03581);
    }
  } else if (blad > 830) {
    s(TEXT.x05386);
  } else {
    s(TEXT.x03583);
  }
  s(TEXT.x03953);
  c("walkhomeXb", TEXT.x03585);
  c("saygoodnight", TEXT.x03586);
}
function walkhomeXb() {
  s(TEXT.x03587);
  if (blad > 835) {
    s(TEXT.x03588);
    if (points < 27) {
      s(TEXT.x03589);
      s(TEXT.x05548);
      s(TEXT.x05387);
      s(TEXT.x03591);
      afterpee();
      s(TEXT.x03592);
    } else {
      s(TEXT.x03593);
    }
  } else {
    s(TEXT.x03594);
    s(TEXT.x03595);
  }
  c("walkhome1", TEXT.x03596);
  c("saygoodnight", TEXT.x03597);
}
function saygoodnight() {
  s(TEXT.x03598);
  c("gameover", TEXT.x03599);
}
function walkhome1() {
  s(TEXT.x03600);
  if (blad > 700 && blad <= 800) {
    s(TEXT.x03601);
    s(TEXT.x03602);
    s(TEXT.x03603);
  } else if (blad > 800 && blad <= 920) {
    s(TEXT.x03604);
    s(TEXT.x03605);
    s(TEXT.x03606);
    getinti(-15);
  } else if (blad > 920) {
    s(TEXT.x03607);
    s(TEXT.x03608);
    s(TEXT.x03609);
    s(TEXT.x03610);
    s(TEXT.x05388);
    c("walkhome1b", TEXT.x03612);
  }
  c("walkhome1a", TEXT.x03613);
}
function walkhome1b() {
  s(TEXT.x03614);
  s(TEXT.x03615);
  s(TEXT.x03616);
  s(TEXT.x03617);
  s(TEXT.x03618);
  s(TEXT.x03619);
  afterpee();
  c("gameover", TEXT.x03620);
}
function walkhome1a() {
  s(TEXT.x03621);
  nightair();
  s(TEXT.x03622);
  s(TEXT.x03623);
  if (blad < 800) standing_desp();
  c("walkhome2", TEXT.x03624);
}
function walkhome2() {
  s(TEXT.x03625);
  blad += 10;
  if (blad > 670) {
    s(TEXT.x03626);
  }
  if (blad > 975) {
    disaster();
  } else {
    if (blad > 875) {
      s(TEXT.x03627);
    } else {
      s(TEXT.x03628);
      getinti(5);
      if (saturday) {
        s(TEXT.x05389);
      } else {
        s(TEXT.x03629);
      }
      if (blad > 800) {
        s(TEXT.x05390);
      } else if (blad > 670) {
        s(TEXT.x03631);
        s(TEXT.x03632);
      } else {
        if (saturday) {
          s(TEXT.x05391);
          getinti(15);
        } else {
          s(TEXT.x03633);
          getinti(15);
        }
      }
    }
    c("walkhome3", TEXT.x03634);
  }
}
function walkhome3() {
  s(TEXT.x03635);
  blad += 10;
  s(TEXT.x03636);
  s(TEXT.x03637);
  getinti(5);
  if (blad > 670 && blad <= 800) {
    s(TEXT.x05392);
  } else if (blad > 800) {
    s(TEXT.x03639);
  } else {
    s(TEXT.x03640);
    getinti(5);
  }
  c("walkhome4", TEXT.x03641);
}
function walkhome4() {
  s(TEXT.x03643);
  blad += 8;
  if (blad < 720) {
    s(TEXT.x03644);
    c("walkhome5", TEXT.x03645);
  } else if (blad < 800) {
    s(TEXT.x03646);
    if (points > 25) {
      s(TEXT.x03647);
      s(TEXT.x03648);
    } else s(TEXT.x03649);
    c("walkhome5", TEXT.x03650);
  } else {
    s(TEXT.x03651);
    s(TEXT.x03652);
    if (points > 26) {
      s(TEXT.x03653);
      s(TEXT.x03654);
      s(TEXT.x03655);
      s(TEXT.x03656);
      s(TEXT.x03657);
    } else {
      s(TEXT.x03658);
    }
    c("walkhomedesp", TEXT.x03659);
  }
}
function walkhomedesp() {
  s(TEXT.x03660);
  if (points > 30) {
    s(TEXT.x03661);
    s(TEXT.x03662);
  } else {
    s(TEXT.x03663);
    s(TEXT.x03664);
  }
  if (blad > 975) {
    disaster();
  } else {
    c("walkhomedesp1", TEXT.x03665);
  }
}
function walkhomedesp1() {
  s(TEXT.x03666);
  if (blad > 975) {
    disaster();
  } else {
    s(TEXT.x03667);
    c("walkhomedesp2", TEXT.x03668);
    c("helphersquat", TEXT.x03669);
    c("sympathise", TEXT.x03670);
  }
}
function walkhomedesp2() {
  s(TEXT.x03671);
  if (blad > 975) {
    disaster();
  } else if (blad < 850) {
    s(TEXT.x03672);
    s(TEXT.x03673);
    s(TEXT.x03674);
    s(TEXT.x03675);
    c("gameover", TEXT.x03676);
  } else {
    s(TEXT.x03677);
    s(TEXT.x03678);
    if (points > 30) {
      s(TEXT.x03679);
      s(TEXT.x03680);
    } else {
      s(TEXT.x05393);
      s(TEXT.x05394);
      s(TEXT.x03682);
      s(TEXT.x03683);
    }
    s(TEXT.x03684);
    c("walkhomedesp3", TEXT.x03685);
  }
}
function walkhomedesp3() {
  s(TEXT.x03686);
  s(TEXT.x03687);
  c("walkhomedesp4", TEXT.x03688);
  c("walkhomedesp5", TEXT.x03689);
}
function walkhomedesp4() {
  s(TEXT.x03690);
  s(TEXT.x03691);
  s(TEXT.x03692);
  c("gameover", TEXT.x03693);
}
function walkhomedesp5() {
  s(TEXT.x03694);
  s(TEXT.x03695);
  c("walkhomedesp6", TEXT.x03696);
}
function walkhomedesp6() {
  s(TEXT.x03697);
  s(TEXT.x03698);
  s(TEXT.x03699);
  s(TEXT.x03700);
  c("walkhomedesp7", TEXT.x03701);
}
function walkhomedesp7() {
  s(TEXT.x03702);
  if (tuesday) {
    s(TEXT.x03703);
    s(TEXT.x03704);
    afterpee();
  } else if (saturday) {
    s(TEXT.x03705);
    s(TEXT.x03706);
    afterpee();
  } else {
    s(TEXT.x03707);
    s(TEXT.x03708);
    s(TEXT.x03709);
    s(TEXT.x03710);
  }
  c("showover", TEXT.x03711);
}
function showover() {
  s(TEXT.x03712);
  c("gameover", TEXT.x03713);
  c("showover1", TEXT.x03714);
}
function showover1() {
  s(TEXT.x03715);
  s(TEXT.x03716);
  s(TEXT.x03717);
  if (inti > 180) {
    s(TEXT.x05395);
    s(TEXT.x03719);
    s(TEXT.x05396);
    s(TEXT.x03721);
    c("showover2", TEXT.x03722);
  } else if (inti > 130) {
    s(TEXT.x05397);
    s(TEXT.x03724);
    s(TEXT.x05398);
    c("gameover", TEXT.x03726);
  } else {
    s(TEXT.x03727);
    c("gameover", TEXT.x03728);
  }
}
function showover2() {
  s(TEXT.x03729);
  s(TEXT.x05399);
  if (tuesday) {
    s(TEXT.x03731);
    s(TEXT.x03732);
    s(TEXT.x03733);
  } else if (thursday) {
    s(TEXT.x03734);
    s(TEXT.x03735);
    s(TEXT.x03736);
  } else {
    s(TEXT.x03737);
    s(TEXT.x03738);
    s(TEXT.x03739);
    s(TEXT.x03740);
    s(TEXT.x05400);
    s(TEXT.x05401);
    s(TEXT.x05402);
  }
  c("gameover", TEXT.x03742);
}
function sympathise() {
  s(TEXT.x03743);
  if (blad > 975) {
    disaster();
  } else {
    s(TEXT.x05403);
    s(TEXT.x05404);
    s(TEXT.x03746);
    s(TEXT.x03747);
    if (blad > 825) {
      s(TEXT.x03748);
      c("sympathise1", TEXT.x03749);
    } else {
      s(TEXT.x03750);
      s(TEXT.x03751);
      s(TEXT.x03752);
      c("gameover", TEXT.x03753);
    }
  }
}
function sympathise1() {
  s(TEXT.x03754);
  if (blad > 975) {
    disaster();
  } else {
    s(TEXT.x03755);
    s(TEXT.x03756);
    c("helphersquat1", TEXT.x03757);
  }
}
function helphersquat() {
  s(TEXT.x03758);
  s(TEXT.x03759);
  s(TEXT.x03760);
  s(TEXT.x03761);
  s(TEXT.x03762);
  c("helphersquat1", TEXT.x03763);
}
function helphersquat1() {
  s(TEXT.x03764);
  if (saturday) {
    s(TEXT.x03765);
  } else if (thursday) {
    s(TEXT.x03766);
  } else {
    s(TEXT.x03767);
  }
  s(TEXT.x03768);
  s(TEXT.x03769);
  blad = 0;
  if (thursday) {
    s(TEXT.x03770);
  } else if (tuesday) {
    s(TEXT.x03771);
  } else {
    s(TEXT.x03772);
  }
  c("helphersquat2", TEXT.x03773);
}
function helphersquat2() {
  s(TEXT.x03774);
  s(TEXT.x03775);
  s(TEXT.x03776);
  c("helphersquat3", TEXT.x03777);
}
function helphersquat3() {
  s(TEXT.x03778);
  s(TEXT.x03779);
  s(TEXT.x03780);
  s(TEXT.x03781);
}
function walkhome5() {
  s(TEXT.x03782);
  if (leavechloe) {
    s(TEXT.x03783);
    c("walkhome6", TEXT.x03784);
  } else {
    s(TEXT.x03785);
    c("gameover", TEXT.x03786);
  }
}
function walkhome6() {
  s(TEXT.x03787);
  s(TEXT.x03788);
  afterpee();
  c("walkhome7", TEXT.x03789);
}
function walkhome7() {
  s(TEXT.x03790);
  s(TEXT.x03791);
  s(TEXT.x03792);
  c("watching1", TEXT.x03793);
}
function watching1() {
  s(TEXT.x03794);
  s(TEXT.x03795);
  s(TEXT.x03796);
  s(TEXT.x03797);
  s(TEXT.x03798);
  if (luckshots >= 1) c("luckytrip19", TEXT.x03799);
  c("watching2", TEXT.x03800);
}
function watching2() {
  s(TEXT.x05405);
  s(TEXT.x03802);
  s(TEXT.x03803);
  c("gameover", TEXT.x03804);
}
function luckytrip19() {
  if (luckshots >= 1) {
    spendLuckshot();
    s(TEXT.x03805);
    s(TEXT.x03806);
    s(TEXT.x03807);
    s(TEXT.x03808);
    c("watching3", TEXT.x03809);
  } else {
    s(TEXT.x03810);
    c("gameover", TEXT.x03811);
  }
}
function watching3() {
  s(TEXT.x03812);
  s(TEXT.x03813);
  s(TEXT.x03814);
  s(TEXT.x03815);
  s(TEXT.x03816);
  s(TEXT.x03817);
  s(TEXT.x03818);
  c("watching4", TEXT.x03819);
}
function watching4() {
  s(TEXT.x03820);
  s(TEXT.x03821);
  s(TEXT.x03822);
  s(TEXT.x03823);
  s(TEXT.x03824);
  c("watching5", TEXT.x03825);
}
function watching5() {
  s(TEXT.x03826);
  if (tiramisu) {
    s(TEXT.x03827);
    s(TEXT.x03828);
    s(TEXT.x03829);
    s(TEXT.x03830);
    s(TEXT.x03831);
    c("watching6", TEXT.x03832);
  } else {
    s(TEXT.x03833);
    s(TEXT.x03834);
    s(TEXT.x03835);
    s(TEXT.x03836);
    s(TEXT.x03837);
    s(TEXT.x03838);
    c("gameover", TEXT.x03839);
  }
}
function watching6() {
  s(TEXT.x03840);
  s(TEXT.x03841);
  s(TEXT.x03842);
  s(TEXT.x03843);
}
function suddenend() {
  s(TEXT.x03844);
  s(TEXT.x03845);
  s(TEXT.x03846);
  s(TEXT.x03847);
  s(TEXT.x03848);
  afterpee();
  c("gameover", TEXT.x03849);
}
function sofatalk() {
  s(TEXT.x03850);
  s(TEXT.x03851);
  c("sofatalk1", TEXT.x03852);
  c("sofatalka", TEXT.x03853);
}
function sofatalka() {
  s(TEXT.x03854);
  if (blad > 550) {
    s(TEXT.x05406);
    s(TEXT.x03856);
    s(TEXT.x03857);
    s(TEXT.x03858);
    s(TEXT.x03859);
    s(TEXT.x05407);
    s(TEXT.x03861);
    c("sofatalkb", TEXT.x03862);
  } else {
    s(TEXT.x03863);
    c("sofagame", TEXT.x03864);
  }
}
function sofatalkb() {
  s(TEXT.x03865);
  s(TEXT.x03866);
  s(TEXT.x03867);
  if (blad < 675) {
    s(TEXT.x03868);
    s(TEXT.x03869);
    s(TEXT.x03870);
    s(TEXT.x03871);
    c("sofatalkc", TEXT.x03872);
  } else {
    s(TEXT.x03873);
    s(TEXT.x03874);
    s(TEXT.x03875);
    c("sofatalkc", TEXT.x03876);
  }
}
function sofatalkc() {
  s(TEXT.x03877);
  s(TEXT.x05408);
  s(TEXT.x05409);
  s(TEXT.x03880);
  blad = 0;
  s(TEXT.x03881);
  s(TEXT.x03882);
  s(TEXT.x04991);
  s(TEXT.x05410);
  c("gobathroom2", TEXT.x03884);
}
function sofatalk1() {
  s(TEXT.x03885);
  if (gourinal) {
    s(TEXT.x03886);
    s(TEXT.x03887);
    s(TEXT.x03888);
    s(TEXT.x03889);
  } else {
    s(TEXT.x03890);
    s(TEXT.x03891);
    s(TEXT.x05411);
    s(TEXT.x05412);
  }
  s(TEXT.x03893);
  s(TEXT.x03894);
  s(TEXT.x04992);
  s(TEXT.x04993);
  c("sofatalk2", TEXT.x03895);
}
function sofatalk2() {
  s(TEXT.x03896);
  proc += 120;
  if (blad > 775) {
    s(TEXT.x03897);
    s(TEXT.x03898);
  }
  if (blad > 680) {
    s(TEXT.x03899);
    s(TEXT.x03900);
    s(TEXT.x03901);
  } else {
    s(TEXT.x03902);
    s(TEXT.x03903);
  }
  s(TEXT.x03904);
  s(TEXT.x03905);
  if (inti < 150) {
    s(TEXT.x03906);
    c("suddenend", TEXT.x03907);
  } else {
    s(TEXT.x03908);
    c("sofatalk3", TEXT.x03909);
  }
}
function sofatalk3() {
  s(TEXT.x03910);
  storytime();
  c("sofatalk4", TEXT.x03911);
}
function sofatalk4() {
  s(TEXT.x05413);
  s(TEXT.x03913);
  storytime1();
  s(TEXT.x03914);
  s(TEXT.x03915);
  s(TEXT.x03916);
  s(TEXT.x03917);
  s(TEXT.x03918);
  c("sofatalk5", TEXT.x03919);
}
function sofatalk5() {
  s(TEXT.x03920);
  s(TEXT.x03921);
  c("askloogo", TEXT.x03922);
  c("askwet", TEXT.x03923);
  c("askwait", TEXT.x03924);
}
function askloogo() {
  s(TEXT.x03925);
  s(TEXT.x03926);
  s(TEXT.x03927);
  c("skirtdeal2", TEXT.x03928);
}
function askwet() {
  s(TEXT.x03929);
  if (admitwetting) {
    s(TEXT.x03930);
    s(TEXT.x03931);
    s(TEXT.x03932);
    s(TEXT.x03933);
    s(TEXT.x03934);
    c("nicelydesp5", TEXT.x03935);
  } else {
    s(TEXT.x03936);
    s(TEXT.x03937);
    c("suddenend", TEXT.x03938);
  }
}
function askwait() {
  s(TEXT.x03939);
  s(TEXT.x03940);
  s(TEXT.x03941);
  proc += 100;
  c("askwait1", TEXT.x03942);
}
function askwait1() {
  s(TEXT.x03943);
  s(TEXT.x03944);
  s(TEXT.x05414);
  s(TEXT.x03946);
  s(TEXT.x03947);
  s(TEXT.x03948);
  afterpee();
  c("gameover", TEXT.x03949);
}
function sofasnog2() {
  if (saturday) {
    s(TEXT.x05415);
  } else {
    s(TEXT.x03950);
  }
  sitting_desp();
  s(TEXT.x03951);
  s(TEXT.x03952);
  s(TEXT.x04056);
  var sofaExploreOptions = 0;
  if (!sofaBreastsDone) {
    c("sofabreasts", TEXT.x03954);
    sofaExploreOptions++;
  }
  if (sofaLegsStage < 2) {
    c("sofalegs", TEXT.x03955);
    sofaExploreOptions++;
  }
  if (!sofaPeeAskedDone) {
    c("sofapee", TEXT.x03956);
    sofaExploreOptions++;
  } else if (blad > 700) {
    c("sofapee", TEXT.x02568d);
    sofaExploreOptions++;
  }
  if (sofaExploreOptions === 0) {
    s(TEXT.x02568c);
    blad += 8;
    getinti(2);
    c("decisions", TEXT.x04049);
    c("sofapee2", TEXT.x04000);
  }
}
function sofalegs() {
  if (sofaLegsStage >= 2) {
    s(TEXT.x02568e);
    blad += 6;
    getinti(1);
    c("decisions", TEXT.x03963);
    return;
  }
  s(TEXT.x03957);
  s(TEXT.x03958);
  if (tuesday) {
    if (sofaLegsStage === 0) {
      s(TEXT.x03959);
      s(TEXT.x03960);
      s(TEXT.x03961);
      sofaLegsStage = 1;
      c("sofalegs1", TEXT.x03962);
    } else {
      s(TEXT.x02568f);
      sofaLegsStage = 2;
      c("sofalegs2", TEXT.x03970);
    }
  } else {
    if (sofaLegsStage === 0) {
      if (saturday) {
        s(TEXT.x05416);
        s(TEXT.x05417);
      } else {
        s(TEXT.x05418);
        s(TEXT.x05419);
      }
      sofaLegsStage = 1;
      c("sofalegs1", TEXT.x05420);
    } else {
      if (saturday) {
        s(TEXT.x05421);
      } else {
        s(TEXT.x05422);
      }
      sofaLegsStage = 2;
      c("sofalegs2", TEXT.x05423);
    }
  }
}
function sofalegs1() {
  if (tuesday) {
    s(TEXT.x03964);
  } else if (saturday) {
    s(TEXT.x05424);
  } else {
    s(TEXT.x05425);
  }
  if (blad > 650 && blad <= 750) {
    s(TEXT.x03965);
  } else if (blad > 750) {
    s(TEXT.x03966);
  } else {
    s(TEXT.x03967);
  }
  if (inti < 150) {
    s(TEXT.x03968);
    c("suddenend", TEXT.x03969);
  } else {
    c("sofalegs2", TEXT.x05426);
  }
}
function sofalegs2() {
  s(TEXT.x03971);
  if (!sofaBreastsDone) c("sofabreasts", TEXT.x03972);
  c("sofalegs2a", TEXT.x03973);
  c("sofapee", TEXT.x05427);
  c("sofadrink", TEXT.x03974);
}
function sofalegs2a() {
  sofaLegsStage = 2;
  if (tuesday) {
    s(TEXT.x03975);
    s(TEXT.x03976);
  } else if (saturday) {
    s(TEXT.x05428);
    s(TEXT.x05429);
  } else {
    s(TEXT.x05430);
    s(TEXT.x05431);
  }
  c("suddenend", TEXT.x03977);
}
function sofapee() {
  if (sofaPeeAskedDone) {
    s(TEXT.x05432);
    if (blad > 800) {
      s(TEXT.x02568g);
      s(TEXT.x03987);
      afterpee();
      c("gameover", TEXT.x03988);
    } else if (blad > 600) {
      s(TEXT.x03989);
      c("sofapee1", TEXT.x03990);
    } else {
      s(TEXT.x02568h);
      c("decisions", TEXT.x05433);
    }
    return;
  }
  sofaPeeAskedDone = 1;
  s(TEXT.x03978);
  if (blad > 600) {
    s(TEXT.x03979);
    s(TEXT.x03980);
    s(TEXT.x03981);
    s(TEXT.x03982);
    s(TEXT.x03983);
    s(TEXT.x03984);
    s(TEXT.x03985);
    if (blad > 800) {
      s(TEXT.x03986);
      s(TEXT.x05434);
      afterpee();
      c("gameover", TEXT.x05435);
    } else {
      s(TEXT.x05436);
      c("sofapee1", TEXT.x05437);
    }
  } else {
    s(TEXT.x03991);
    c("walkhomeX", TEXT.x03992);
  }
}
function sofapee1() {
  s(TEXT.x03993);
  s(TEXT.x03994);
  s(TEXT.x03995);
  s(TEXT.x03996);
  s(TEXT.x03997);
  c("decisions", TEXT.x03998);
  c("walkhomeX", TEXT.x05438);
  c("sofapee2", TEXT.x05439);
}
function sofapee2() {
  s(TEXT.x04001);
  c("sofatheatre", TEXT.x04002);
  c("sofastamps", TEXT.x04003);
  c("sofatrains", TEXT.x04004);
  c("sofawork", TEXT.x04005);
  c("sofatoilet", TEXT.x04006);
  if (!sofaOfferLooDone) c("givechance1", TEXT.x05440);
  c("excuseme1", TEXT.x05441);
}
function sofabreasts() {
  sofaBreastsDone = 1;
  if (saturday) {
    s(TEXT.x05442);
  } else {
    s(TEXT.x04007);
  }
  s(TEXT.x04008);
  c("sofabreasts0", TEXT.x04009);
  c("sofabreasts3", TEXT.x04010);
}
function sofabreasts0() {
  if (undobra) {
    s(TEXT.x04011);
    s(TEXT.x04012);
    c("sofapee1", TEXT.x04013);
  } else {
    s(TEXT.x04014);
    if (buyespresso) {
      s(TEXT.x04015);
      if (saturday) {
        s(TEXT.x05443);
        getinti(15);
        s(TEXT.x05444);
      } else {
        s(TEXT.x04016);
        getinti(15);
        s(TEXT.x04017);
      }
      s(TEXT.x04018);
      s(TEXT.x04019);
      c("sofabreasts1", TEXT.x04020);
    } else {
      s(TEXT.x04021);
      s(TEXT.x04022);
      c("readytoleave", TEXT.x04023);
    }
  }
}
function sofabreasts1() {
  s(TEXT.x04024);
  undobra = 1;
  s(TEXT.x04025);
  if (blad > 650) {
    s(TEXT.x04026);
  } else {
    s(TEXT.x04027);
  }
  c("sofabreasts2", TEXT.x04028);
}
function sofabreasts2() {
  s(TEXT.x04029);
  getinti(10);
  if (blad > 650) {
    s(TEXT.x04030);
    c("sofabreasts2a", TEXT.x04031);
  } else {
    s(TEXT.x04032);
    c("sofabreasts3", TEXT.x04033);
  }
}
function sofabreasts2a() {
  s(TEXT.x04034);
  s(TEXT.x04035);
  s(TEXT.x04036);
  s(TEXT.x04037);
  afterpee();
  c("gameover", TEXT.x04038);
}
function sofabreasts3() {
  s(TEXT.x04039);
  s(TEXT.x04040);
  if (saturday) {
    s(TEXT.x04041);
    s(TEXT.x04042);
  } else {
    s(TEXT.x04043);
    s(TEXT.x04044);
    s(TEXT.x04045);
  }
  c("sofabreasts4", TEXT.x04046);
}
function sofabreasts4() {
  s(TEXT.x04047);
  getinti(undobra ? 16 : 10);
  if (blad > 570) {
    s(TEXT.x04048);
    c("decisions", TEXT.x05445);
  } else {
    c("sofadrink", TEXT.x04050);
    c("asknight", TEXT.x04051);
  }
}
function asknight() {
  s(TEXT.x04052);
  s(TEXT.x04053);
  s(TEXT.x04054);
  c("walkhomeX", TEXT.x04055);
}
function decisions() {
  s(TEXT.x05446);
  c("sofakiss", TEXT.x04057);
  c("sofapee", TEXT.x04058);
  c("walkhomeX", TEXT.x04059);
  c("sofapee2", TEXT.x04060);
  c("sofadrink", TEXT.x04061);
}
function watchdesperate() {
  s(TEXT.x04062);
  s(TEXT.x04063);
  s(TEXT.x04064);
  s(TEXT.x04065);
  s(TEXT.x04066);
  c("gameover", TEXT.x04067);
}
function busqueue3() {
  s(TEXT.x04068);
  blad += 15;
  s(TEXT.x04069);
  if (blad > 660) {
    s(TEXT.x05447);
    s(TEXT.x04994);
    s(TEXT.x04995);
    s(TEXT.x04071);
    c("queue1a", TEXT.x04072);
  } else {
    s(TEXT.x04073);
    getinti(5);
    c("busqueue4", TEXT.x04074);
  }
}
function queue1a() {
  s(TEXT.x04075);
  c("queue1b", TEXT.x04076);
  c("watchblonde", TEXT.x04077);
  c("canthelp", TEXT.x04078);
}
function watchblonde() {
  s(TEXT.x04079);
  s(TEXT.x04080);
  s(TEXT.x04081);
  s(TEXT.x04082);
  s(TEXT.x04083);
  s(TEXT.x04084);
  getinti(-15);
  c("busqueue6", TEXT.x04085);
}
function queue1b() {
  s(TEXT.x04086);
  s(TEXT.x04087);
  s(TEXT.x05549);
  getinti(10);
  c("carparka", TEXT.x04088);
}
function canthelp() {
  s(TEXT.x04089);
  s(TEXT.x04090);
  s(TEXT.x04091);
  s(TEXT.x04092);
  getinti(-15);
  s(TEXT.x05448);
  s(TEXT.x04094);
  c("gameover", TEXT.x04095);
}
function carparka() {
  s(TEXT.x04096);
  blad += 10;
  if (gettaxi) {
    s(TEXT.x04097);
    s(TEXT.x04098);
    c("carparka0", TEXT.x04099);
  } else {
    s(TEXT.x04100);
    if (ravioli) {
      s(TEXT.x04101);
      s(TEXT.x04102);
      s(TEXT.x04103);
      c("onbus", TEXT.x04104);
    } else {
      s(TEXT.x04105);
      s(TEXT.x04106);
      s(TEXT.x04996);
      getinti(5);
      c("carparka0", TEXT.x04107);
    }
  }
}
function carparka0() {
  s(TEXT.x04108);
  s(TEXT.x04109);
  s(TEXT.x04110);
  c("carparka1", TEXT.x04111);
}
function onbus() {
  s(TEXT.x04112);
  s(TEXT.x04113);
  getinti(-5);
  s(TEXT.x04114);
  c("onbus1", TEXT.x04115);
}
function onbus1() {
  s(TEXT.x04116);
  getinti(-5);
  s(TEXT.x04117);
  s(TEXT.x04118);
  c("onbus2", TEXT.x04119);
}
function onbus2() {
  s(TEXT.x04120);
  s(TEXT.x04121);
  s(TEXT.x04122);
  getinti(-5);
  if (luckshots >= 1) {
    capEndgameLuckshots();
    s(TEXT.x04123);
  }
  c("bushome", TEXT.x04124);
}
function carparka1() {
  s(TEXT.x04125);
  if (merlot) {
    s(TEXT.x04126);
    afterpee();
    s(TEXT.x04127);
    s(TEXT.x04128);
    s(TEXT.x04997);
    getinti(5);
    s(TEXT.x04129);
    s(TEXT.x05449);
    s(TEXT.x04131);
    c("taxihome1", TEXT.x04132);
  } else if (chardonnay) {
    s(TEXT.x04133);
    afterpee();
    s(TEXT.x04134);
    s(TEXT.x04135);
    s(TEXT.x04998);
    getinti(5);
    s(TEXT.x04136);
    s(TEXT.x04137);
    c("taxihome1", TEXT.x04138);
  } else if (pinot) {
    s(TEXT.x04139);
    s(TEXT.x04140);
    s(TEXT.x04141);
    s(TEXT.x04999);
    s(TEXT.x05450);
    s(TEXT.x05451);
    getinti(5);
    afterpee();
    s(TEXT.x04142);
    s(TEXT.x04143);
    s(TEXT.x04144);
    c("taxihome1", TEXT.x04145);
  } else {
    s(TEXT.x04146);
    s(TEXT.x04147);
    blad += 10;
    standing_desp();
    c("carparka2", TEXT.x04148);
  }
}
function carparka2() {
  s(TEXT.x04149);
  blad += 10;
  s(TEXT.x04150);
  s(TEXT.x05452);
  s(TEXT.x04152);
  s(TEXT.x04153);
  s(TEXT.x05001);
  s(TEXT.x04154);
  s(TEXT.x04155);
  s(TEXT.x05002);
  s(TEXT.x05003);
  s(TEXT.x04156);
  s(TEXT.x04157);
  s(TEXT.x05004);
  s(TEXT.x05005);
  c("carparka3", TEXT.x04158);
}
function carparka3() {
  s(TEXT.x04159);
  c("peepround", TEXT.x04160);
  c("peepunder", TEXT.x04161);
  c("gentleman", TEXT.x04162);
}
function peepround() {
  s(TEXT.x04163);
  s(TEXT.x04164);
  s(TEXT.x04165);
  squat = 1;
  gopee = 1;
  s(TEXT.x04166);
  afterpee();
  s(TEXT.x04167);
  c("peepround1", TEXT.x04168);
}
function peepround1() {
  s(TEXT.x05453);
  blad += 10;
  s(TEXT.x04170);
  s(TEXT.x04171);
  c("taxihome1", TEXT.x04174);
}
function gentleman() {
  s(TEXT.x04175);
  s(TEXT.x04176);
  blad = 0;
  s(TEXT.x04177);
  s(TEXT.x04178);
  s(TEXT.x05006);
  s(TEXT.x04179);
  s(TEXT.x04180);
  c("gameover", TEXT.x04181);
}
function peepunder() {
  s(TEXT.x04182);
  s(TEXT.x04183);
  s(TEXT.x04184);
  afterpee();
  s(TEXT.x04185);
  squat = 1;
  if (pizza) {
    s(TEXT.x04186);
    c("gameover", TEXT.x04187);
  } else {
    s(TEXT.x05460);
    gopee = 1;
    c("taxihome1", TEXT.x04189);
  }
}
function busqueue4() {
  s(TEXT.x04190);
  blad += 10;
  s(TEXT.x04191);
  queue_desp();
  s(TEXT.x04192);
  if (chardonnay) {
    s(TEXT.x04193);
    s(TEXT.x04194);
  } else {
    s(TEXT.x04195);
  }
  if (inti < 75) s(TEXT.x04196);
  else if (inti < 100) s(TEXT.x04197);
  else s(TEXT.x04198);
  c("busqueue5", TEXT.x04199);
}
function busqueue5() {
  s(TEXT.x04200);
  blad += 10;
  s(TEXT.x04201);
  s(TEXT.x04202);
  if (chardonnay) {
    s(TEXT.x04203);
    s(TEXT.x04204);
    s(TEXT.x04205);
    getinti(-5);
    c("carpark", TEXT.x04206);
  } else c("busqueue6", TEXT.x04207);
}
function carpark() {
  s(TEXT.x04208);
  blad += 5;
  s(TEXT.x04209);
  c("carpark1", TEXT.x04210);
}
function carpark1() {
  s(TEXT.x04211);
  blad += 5;
  s(TEXT.x04212);
  s(TEXT.x04213);
  s(TEXT.x04214);
  c("carpark2", TEXT.x04215);
}
function carpark2() {
  s(TEXT.x04216);
  if (spagbol) {
    s(TEXT.x04217);
    s(TEXT.x04218);
    s(TEXT.x04219);
    s(TEXT.x04220);
    s(TEXT.x04221);
    s(TEXT.x04222);
    s(TEXT.x04223);
    s(TEXT.x04224);
    s(TEXT.x04225);
    c("gameover", TEXT.x04226);
  } else {
    s(TEXT.x04227);
    getinti(-10);
    if (carparklie) {
      s(TEXT.x05060);
    } else {
      s(TEXT.x04228);
    }
    c("carpark3", TEXT.x04229);
  }
}
function carpark3() {
  s(TEXT.x04230);
  blad += 10;
  s(TEXT.x05461);
  s(TEXT.x04232);
  if (inti < 75) {
    s(TEXT.x04233);
    getinti(12);
  } else {
    s(TEXT.x04235);
    getinti(-10);
  }
  c("busqueue7", TEXT.x04234);
}
function busqueue6() {
  s(TEXT.x04237);
  blad += 10;
  queue_desp();
  if (blad > 750) {
    s(TEXT.x04239);
    getinti(-10);
  }
  s(TEXT.x04240);
  s(TEXT.x04241);
  if (luckshots >= 1) {
    c("luckytrip7", TEXT.x05462);
  }
  if (thursday) {
    c("busqueue6a", TEXT.x04242);
  } else {
    c("busqueue7", TEXT.x04243);
  }
}
function luckytrip7() {
  s(TEXT.x05053);
  spendLuckshot();
  carparklie = 1;
  s(TEXT.x05054);
  s(TEXT.x05058);
  s(TEXT.x05059);
  s(TEXT.x05055);
  c("carparkalone", TEXT.x05056);
}
function carparkalone() {
  s(TEXT.x05057);
  s(TEXT.x05463);
  s(TEXT.x05464);
  c("carpark2", TEXT.x05465);
}
function busqueue6a() {
  s(TEXT.x04244);
  if (blad > 750) {
    s(TEXT.x04245);
    s(TEXT.x04246);
    s(TEXT.x04247);
    s(TEXT.x04248);
    s(TEXT.x04249);
    s(TEXT.x05466);
  } else {
    s(TEXT.x04251);
  }
  c("busqueue7", TEXT.x04252);
}
function busqueue7() {
  s(TEXT.x04253);
  blad += 2;
  if (blad > 760) {
    s(TEXT.x04254);
    if (tuesday) {
      s(TEXT.x04255);
    } else if (thursday) {
      s(TEXT.x04256);
    } else {
      s(TEXT.x04257);
    }
    s(TEXT.x04258);
    c("lastgamble", TEXT.x04259);
  } else {
    s(TEXT.x04260);
    capEndgameLuckshots();
    c("bushome", TEXT.x04261);
  }
}
function lastgamble() {
  s(TEXT.x04262);
  s(TEXT.x04263);
  s(TEXT.x04264);
  if (luckshots >= 1) c("luckytrip28", TEXT.x04265);
  c("gameover", TEXT.x04266);
}
function luckytrip28() {
  if (luckshots >= 1) {
    s(TEXT.x04267);
    spendLuckshot();
    s(TEXT.x04268);
    s(TEXT.x04269);
    c("searchdiane", TEXT.x04270);
  } else {
    s(TEXT.x04271);
    c("gameover", TEXT.x04272);
  }
}
function searchdiane() {
  s(TEXT.x04273);
  c("search1", TEXT.x04274);
  c("search2", TEXT.x04275);
  c("search3", TEXT.x04276);
}
function search1() {
  s(TEXT.x04277);
  s(TEXT.x04278);
  s(TEXT.x04279);
  if (saturday) {
    s(TEXT.x04280);
    s(TEXT.x04281);
    s(TEXT.x04282);
    s(TEXT.x04283);
    c("search1a", TEXT.x04284);
  } else {
    s(TEXT.x04285);
    s(TEXT.x04286);
    c("gameover", TEXT.x04287);
    if (luckshots >= 1) c("luckytrip28", TEXT.x04288);
  }
}
function search3() {
  s(TEXT.x04289);
  if (thursday) {
    s(TEXT.x04290);
    s(TEXT.x04291);
    s(TEXT.x04292);
    c("goupsteps", TEXT.x04293);
    c("passage", TEXT.x04294);
  } else {
    s(TEXT.x04295);
    s(TEXT.x04296);
    c("gameover", TEXT.x04297);
    if (luckshots >= 1) c("luckytrip28", TEXT.x04298);
  }
}
function passage() {
  s(TEXT.x04299);
  s(TEXT.x04300);
  c("passage1", TEXT.x04301);
}
function passage1() {
  s(TEXT.x04302);
  s(TEXT.x04303);
  s(TEXT.x04304);
  s(TEXT.x04305);
  if (pannacotta) {
    c("passage2a", TEXT.x04306);
  } else {
    c("passage2b", TEXT.x04307);
  }
}
function passage2b() {
  s(TEXT.x04308);
  s(TEXT.x04309);
  s(TEXT.x04310);
  s(TEXT.x04311);
  blad = 0;
  c("gameover", TEXT.x04312);
}
function passage2a() {
  s(TEXT.x04313);
  s(TEXT.x05467);
  s(TEXT.x04315);
  c("passage2aa", TEXT.x04316);
}
function passage2aa() {
  s(TEXT.x04317);
  s(TEXT.x04318);
  s(TEXT.x04319);
  s(TEXT.x04320);
  blad = 0;
  s(TEXT.x04321);
  c("passage2ab", TEXT.x04322);
}
function passage2ab() {
  s(TEXT.x04323);
  s(TEXT.x04324);
  s(TEXT.x04325);
  c("passage2ac", TEXT.x04326);
}
function passage2ac() {
  s(TEXT.x04327);
  s(TEXT.x04328);
  if (buyespresso) {
    s(TEXT.x04329);
    s(TEXT.x04330);
    c("gameover", TEXT.x04331);
  } else {
    s(TEXT.x04332);
    s(TEXT.x04333);
    s(TEXT.x04334);
    c("consolation", TEXT.x04335);
  }
}
function goupsteps() {
  s(TEXT.x04336);
  s(TEXT.x04337);
  s(TEXT.x04338);
  c("gameover", TEXT.x04339);
}
function search1a() {
  s(TEXT.x04340);
  s(TEXT.x04341);
  s(TEXT.x04342);
  s(TEXT.x04343);
  s(TEXT.x04344);
  blad = 0;
  c("search1b", TEXT.x04345);
}
function search1b() {
  s(TEXT.x04346);
  c("consolation", TEXT.x04347);
}
function search2() {
  s(TEXT.x04348);
  s(TEXT.x04349);
  s(TEXT.x04350);
  if (tuesday) {
    s(TEXT.x04351);
    s(TEXT.x04352);
    s(TEXT.x04353);
    s(TEXT.x04354);
    if (luckshots >= 1) c("luckytrip29", TEXT.x04355);
    c("luckytrip28a", TEXT.x04356);
    c("gameover", TEXT.x04357);
  } else {
    s(TEXT.x04358);
    c("gameover", TEXT.x04359);
    if (luckshots >= 1) c("luckytrip28", TEXT.x04360);
  }
}
function luckytrip29() {
  if (luckshots >= 1) {
    s(TEXT.x04361);
    spendLuckshot();
    s(TEXT.x04362);
    s(TEXT.x04363);
    c("luckytrip29a", TEXT.x04364);
  } else {
    s(TEXT.x04365);
    c("gameover", TEXT.x04366);
  }
}
function luckytrip29a() {
  s(TEXT.x04367);
  s(TEXT.x04368);
  s(TEXT.x04369);
  s(TEXT.x04370);
  afterpee();
  c("gameover", TEXT.x04371);
}
function luckytrip28a() {
  s(TEXT.x04372);
  s(TEXT.x04373);
  s(TEXT.x04374);
  s(TEXT.x04375);
  s(TEXT.x04376);
  s(TEXT.x04377);
  s(TEXT.x04378);
  c("goleft", TEXT.x04379);
  c("goright", TEXT.x04380);
}
function goleft() {
  s(TEXT.x04381);
  s(TEXT.x04382);
  c("goleft1", TEXT.x04383);
}
function goright() {
  s(TEXT.x04384);
  s(TEXT.x04385);
  c("goright1", TEXT.x04386);
}
function goright1() {
  s(TEXT.x04387);
  s(TEXT.x04388);
  s(TEXT.x04389);
  s(TEXT.x04390);
  afterpee();
  c("gameover", TEXT.x04391);
}
function goleft1() {
  s(TEXT.x04392);
  s(TEXT.x04393);
  s(TEXT.x04394);
  c("goleft2", TEXT.x04395);
}
function goleft2() {
  s(TEXT.x04396);
  s(TEXT.x04397);
  s(TEXT.x04398);
  s(TEXT.x04399);
  s(TEXT.x04400);
  blad = 0;
  c("goleft3", TEXT.x04401);
}
function goleft3() {
  s(TEXT.x04402);
  c("goleft4", TEXT.x04403);
}
function goleft4() {
  s(TEXT.x04404);
  c("ending5", TEXT.x04405);
}
function ending5() {
  s(TEXT.x04406);
  s(TEXT.x04407);
  s(TEXT.x04408);
  s(TEXT.x04409);
  c("consolation", TEXT.x04410);
}
function bushome() {
  s(TEXT.x04411);
  s(TEXT.x04412);
  sitting_desp();
  c("bushome1", TEXT.x04413);
}
function bushome1() {
  if (blad < 500) {
    s(TEXT.x04416);
    getinti(10);
  } else if (blad < 670) {
    s(TEXT.x04417);
    getinti(5);
    s(TEXT.x04418);
  } else {
    s(TEXT.x04419);
    s(TEXT.x04420);
  }
  c("bushome2", TEXT.x04421);
}
function bushome2() {
  s(TEXT.x04414);
  if (rioja) {
    s(TEXT.x04423);
    s(TEXT.x04424);
    getinti(-10);
    s(TEXT.x04425);
  } else {
    sitting_desp();
  }
  c("bushome3", TEXT.x04427);
}
function bushome3() {
  if (bottlewater) {
    if (blad <= 600) {
      s(TEXT.x05468);
      getinti(1);
      s(TEXT.x04432);
      proc += 50;
    } else if (blad <= 750) {
      s(TEXT.x05469);
      getinti(1);
      s(TEXT.x05470);
      proc += 25;
    } else {
      s(TEXT.x05471);
      s(TEXT.x05472);
    }
  } else if (rioja) {
    s(TEXT.x04432b);
  } else {
    s(TEXT.x04433);
  }
  c("bushome4", TEXT.x04434);
}
function bushome4() {
  s(TEXT.x04436);
  if (rioja) {
    s(TEXT.x04437);
    s(TEXT.x04438);
    getinti(-10);
  } else {
    s(TEXT.x04439);
    sitting_desp();
  }
  c("bushome5", TEXT.x04440);
}
function bushome5() {
  s(TEXT.x04442);
  s(TEXT.x04443);
  s(TEXT.x04444);
  if (rioja) {
    s(TEXT.x04445);
    s(TEXT.x04446);
    getinti(-10);
  } else {
    s(TEXT.x04447);
  }
  c("bushome6", TEXT.x04448);
}
function bushome6() {
  s(TEXT.x04450);
  if (rioja) {
    s(TEXT.x04451);
    s(TEXT.x04452);
    c("peestop1", TEXT.x04453);
  } else {
    s(TEXT.x04454);
    if (blad < 625) {
      s(TEXT.x04455);
      c("bushome7", TEXT.x04456);
    } else {
      s(TEXT.x04457);
      s(TEXT.x04458);
      getinti(3);
      s(TEXT.x04459);
      s(TEXT.x04460);
      s(TEXT.x04461);
      s(TEXT.x04462);
      if (luckshots >= 1) c("luckytrip17", TEXT.x04463);
      c("gameover", TEXT.x04464);
    }
  }
}
function bushome7() {
  s(TEXT.x04465);
  s(TEXT.x04466);
  if (inti > 140) {
    s(TEXT.x04467);
    s(TEXT.x04468);
    c("arrivehome", TEXT.x04469);
  } else {
    s(TEXT.x04470);
    c("gameover", TEXT.x04471);
  }
}
function luckytrip17() {
  if (luckshots >= 1) {
    s(TEXT.x04472);
    spendLuckshot();
    s(TEXT.x04473);
    c("luckytrip17a", TEXT.x04474);
  } else {
    s(TEXT.x04475);
    c("gameover", TEXT.x04476);
  }
}
function luckytrip17a() {
  s(TEXT.x04477);
  s(TEXT.x04478);
  s(TEXT.x04479);
  c("luckytrip17b", TEXT.x04480);
}
function peestop1() {
  s(TEXT.x04481);
  s(TEXT.x04482);
  s(TEXT.x04483);
  s(TEXT.x04484);
  c("peestop2", TEXT.x04485);
}
function peestop2() {
  s(TEXT.x04486);
  s(TEXT.x04487);
  s(TEXT.x04488);
  s(TEXT.x04489);
  c("luckytrip17b", TEXT.x04490);
}
function luckytrip17b() {
  if (tuesday) {
    s(TEXT.x04491);
    c("gameover", TEXT.x04492);
  } else if (saturday) {
    s(TEXT.x04493);
    s(TEXT.x04494);
    c("walkhome6", TEXT.x04495);
  } else {
    s(TEXT.x04496);
    s(TEXT.x04497);
    if (blad > 715) {
      s(TEXT.x04498);
      s(TEXT.x04499);
      s(TEXT.x04500);
      s(TEXT.x04501);
      blad = 0;
      s(TEXT.x04502);
      s(TEXT.x04503);
    } else {
      s(TEXT.x04504);
    }
    c("gameover", TEXT.x04505);
  }
}
function nicelydesp() {
  s(TEXT.x04506);
  s(TEXT.x04507);
  if (gopee) {
    s(TEXT.x04508);
    s(TEXT.x04509);
    s(TEXT.x04510);
    s(TEXT.x04511);
    c("nicelydesp1", TEXT.x04512);
  } else {
    s(TEXT.x04513);
    afterpee();
    s(TEXT.x04514);
    c("gameover", TEXT.x04515);
  }
}
function nicelydesp6() {
  s(TEXT.x04516);
  s(TEXT.x04517);
  if (tuesday) {
    s(TEXT.x04518);
    s(TEXT.x04519);
    c("nicelydesp7", TEXT.x04520);
  } else if (thursday) {
    s(TEXT.x04521);
    s(TEXT.x04522);
    c("nicelydesp7", TEXT.x04523);
  } else if (saturday) {
    s(TEXT.x04524);
    s(TEXT.x04525);
    s(TEXT.x04526);
    c("bathpee", TEXT.x04527);
  }
}
function bathpee() {
  s(TEXT.x04528);
  s(TEXT.x04529);
  s(TEXT.x04530);
  s(TEXT.x04531);
  c("bathpee1", TEXT.x04532);
}
function bathpee1() {
  s(TEXT.x04533);
  s(TEXT.x04534);
  s(TEXT.x04535);
  s(TEXT.x04536);
  s(TEXT.x04537);
  blad = 0;
  s(TEXT.x04538);
  s(TEXT.x04539);
  s(TEXT.x04540);
  c("secondplace", TEXT.x04541);
}
function nicelydesp7() {
  s(TEXT.x04542);
  if (tuesday) {
    s(TEXT.x04543);
  } else {
    s(TEXT.x04544);
  }
  s(TEXT.x04545);
  s(TEXT.x04546);
  s(TEXT.x04547);
  c("nicelydesp8", TEXT.x04548);
}
function nicelydesp8() {
  s(TEXT.x04549);
  s(TEXT.x04550);
  s(TEXT.x04550a);
  s(TEXT.x05473);
  s(TEXT.x04552);
  s(TEXT.x04553);
  s(TEXT.x04554);
  s(TEXT.x04555);
  blad = 0;
  c("nicelydesp9", TEXT.x04556);
}
function nicelydesp9() {
  s(TEXT.x04557);
  s(TEXT.x04558);
  s(TEXT.x04559);
  s(TEXT.x04560);
  c("secondplace", TEXT.x04561);
}
function secondplace() {
  s(TEXT.x04562);
  s(TEXT.x04563);
  c("secondplace1", TEXT.x04564);
}
function secondplace1() {
  s(TEXT.x04565);
  s(TEXT.x04566);
  s(TEXT.x04567);
  s(TEXT.x04568);
  s(TEXT.x04569);
  s(TEXT.x04570);
}
function lootogether() {
  s(TEXT.x04571);
  c("lootogether1", TEXT.x04572);
}
function lootogether1() {
  if (thursday) {
    s(TEXT.x04573);
  } else if (tuesday) {
    s(TEXT.x05540);
  } else {
    s(TEXT.x05541);
  }
  if (inti < 110) {
    s(TEXT.x04574);
    s(TEXT.x04575);
    s(TEXT.x04576);
    if (thursday) {
      s(TEXT.x04577);
    } else {
      s(TEXT.x05542);
    }
    blad = 0;
    s(TEXT.x04578);
    c("lootogether2", TEXT.x04579);
  } else {
    s(TEXT.x04580);
    c("ontoilet", TEXT.x04581);
  }
}
function ontoilet() {
  s(TEXT.x04582);
  if (blad < 675) {
    s(TEXT.x04583);
    s(TEXT.x04584);
    s(TEXT.x04585);
    s(TEXT.x04586);
    c("ontoilet1", TEXT.x04587);
  } else {
    s(TEXT.x04588);
    s(TEXT.x04589);
    s(TEXT.x04590);
    c("ontoilet1", TEXT.x04591);
  }
}
function ontoilet1() {
  s(TEXT.x04592);
  if (squat) {
    s(TEXT.x04593);
    s(TEXT.x04594);
    s(TEXT.x04595);
    blad = 0;
    s(TEXT.x04596);
    s(TEXT.x04597);
    if (thursday) {
      s(TEXT.x05007);
    } else if (tuesday) {
      s(TEXT.x05543);
    } else {
      s(TEXT.x05544);
    }
    if (thursday) {
      s(TEXT.x04598);
    } else {
      s(TEXT.x05545);
    }
    c("ontoilet2", TEXT.x04599);
  } else {
    if (thursday) {
      s(TEXT.x04600);
    } else {
      s(TEXT.x05546);
    }
    blad = 0;
    s(TEXT.x04601);
    c("lootogether2", TEXT.x04602);
  }
}
function ontoilet2() {
  s(TEXT.x04603);
  s(TEXT.x04604);
  c("fifthplace", TEXT.x04605);
}
function fifthplace() {
  s(TEXT.x04606);
  s(TEXT.x04607);
  s(TEXT.x04608);
  s(TEXT.x04609);
  s(TEXT.x04610);
}
function lootogether2() {
  if (thursday) {
    s(TEXT.x04611);
  } else {
    s(TEXT.x05547);
  }
  s(TEXT.x04612);
  s(TEXT.x04613);
  s(TEXT.x04614);
  c("lootogether3", TEXT.x04615);
}
function lootogether3() {
  s(TEXT.x04616);
  c("gameover", TEXT.x04617);
}
function story() {
  s(TEXT.x04618);
  s(TEXT.x04619);
  storytime();
  s(TEXT.x04620);
  c("story1", TEXT.x04621);
}
function story1() {
  s(TEXT.x04622);
  storytime1();
  s(TEXT.x04623);
  s(TEXT.x04624);
  c("story2", TEXT.x04625);
}
function story2() {
  s(TEXT.x04626);
  s(TEXT.x04627);
  if (inti < 155) {
    s(TEXT.x04628);
    s(TEXT.x04629);
    s(TEXT.x04630);
    afterpee();
    c("gameover", TEXT.x04631);
  } else {
    s(TEXT.x04632);
    c("story3", TEXT.x04633);
  }
}
function story3() {
  s(TEXT.x04634);
  s(TEXT.x04635);
  s(TEXT.x04636);
  c("story4", TEXT.x04637);
}
function story4() {
  s(TEXT.x04638);
  s(TEXT.x04639);
  s(TEXT.x04640);
  s(TEXT.x04641);
  s(TEXT.x04642);
  c("story5", TEXT.x04643);
}
function story5() {
  afterpee();
  s(TEXT.x04644);
  s(TEXT.x04645);
  s(TEXT.x04646);
  s(TEXT.x04647);
}
function gameover() {
  s(TEXT.x04648);
}
var despLineIndex = 0;
var notYetSitting = new Array(TEXT.x05504, TEXT.x05505, TEXT.x05506, TEXT.x05507);
var notYetStanding = new Array(TEXT.x05508, TEXT.x05509, TEXT.x05510, TEXT.x05511);
var notYetQueue = new Array(TEXT.x05512, TEXT.x05513, TEXT.x05514, TEXT.x05515);
function sitting_desp() {
  if (blad < 400) s(TEXT.x04649);
  if (blad < 425) {
    s(notYetSitting[despLineIndex % notYetSitting.length]);
    despLineIndex++;
  } else if (blad < 450) s(TEXT.x04651);
  else if (blad < 500) s(TEXT.x04652);
  else if (blad < 525) s(TEXT.x04653);
  else if (blad < 550) s(TEXT.x04654);
  else if (blad < 575) s(TEXT.x04655);
  else if (blad < 600) s(TEXT.x04656);
  else if (blad < 625) s(TEXT.x04657);
  else if (blad < 650) s(TEXT.x04658);
  else if (blad < 675) s(TEXT.x04659);
  else if (blad < 700) s(TEXT.x04660);
  else if (blad < 725) s(TEXT.x04661);
  else if (blad < 750) {
    if (saturday) s(TEXT.x04662);
    else s(TEXT.x04663);
  } else if (blad < 775) {
    if (saturday) s(TEXT.x04664);
    else s(TEXT.x04665);
  } else if (blad < 800) s(TEXT.x04666);
  else if (blad < 825) s(TEXT.x04667);
  else if (blad < 850) s(TEXT.x04668);
  else if (blad < 875) s(TEXT.x04669);
  else if (blad < 900) s(TEXT.x04670);
  else s(TEXT.x04671);
}
function standing_desp() {
  if (blad < 400) s(TEXT.x04672);
  if (blad < 425) {
    s(notYetStanding[despLineIndex % notYetStanding.length]);
    despLineIndex++;
  } else if (blad < 450) s(TEXT.x04674);
  else if (blad < 475) s(TEXT.x04675);
  else if (blad < 500) s(TEXT.x04676);
  else if (blad < 525) s(TEXT.x04677);
  else if (blad < 550) s(TEXT.x04678);
  else if (blad < 575) s(TEXT.x04679);
  else if (blad < 600) s(TEXT.x04680);
  else if (blad < 625) s(TEXT.x04681);
  else if (blad < 650) s(TEXT.x04682);
  else if (blad < 675) s(TEXT.x04683);
  else if (blad < 700) s(TEXT.x04684);
  else if (blad < 725) {
    if (saturday) s(TEXT.x04685);
    else s(TEXT.x04686);
  } else if (blad < 750) s(TEXT.x04687);
  else if (blad < 775) s(TEXT.x04688);
  else if (blad < 800) s(TEXT.x04689);
  else if (blad < 825) s(TEXT.x04690);
  else if (blad < 850) s(TEXT.x04691);
  else if (blad < 900) s(TEXT.x04692);
  else if (blad < 950) s(TEXT.x04693);
  else s(TEXT.x04694);
}
function queue_desp() {
  if (blad < 475) {
    s(notYetQueue[despLineIndex % notYetQueue.length]);
    despLineIndex++;
  } else if (blad < 525) s(TEXT.x04696);
  else if (blad < 550) s(TEXT.x04697);
  else if (blad < 575) s(TEXT.x04698);
  else if (blad < 600) s(TEXT.x04699);
  else if (blad < 625) s(TEXT.x04700);
  else if (blad < 650) s(TEXT.x04701);
  else if (blad < 675) s(TEXT.x04702);
  else if (blad < 700) s(TEXT.x04703);
  else if (blad < 725) s(TEXT.x04704);
  else if (blad < 750) s(TEXT.x04705);
  else if (blad < 775) s(TEXT.x04706);
  else if (blad < 800) s(TEXT.x04707);
  else if (blad < 825) s(TEXT.x04708);
  else if (blad < 850) s(TEXT.x04709);
  else if (blad < 875) s(TEXT.x04710);
  else if (blad < 900) s(TEXT.x05477);
  else if (blad < 925) s(TEXT.x04712);
  else {
    s(TEXT.x04713);
  }
}
function emitDuoDesp(key) {
  if (key === 0) {
    s(TEXT.x05552);
    return true;
  } else if (key === 1) {
    s(TEXT.x05553);
    return true;
  } else if (key === 2) {
    s(TEXT.x05554);
    return true;
  } else if (key === 3) {
    s(TEXT.x05555);
    return true;
  } else if (key === 4) {
    s(TEXT.x05556);
    return true;
  } else if (key === 5) {
    s(TEXT.x05557);
    return true;
  } else if (key === 6) {
    s(TEXT.x05558);
    return true;
  } else if (key === 7) {
    s(TEXT.x05559);
    return true;
  } else if (key === 8) {
    s(TEXT.x05560);
    return true;
  } else return false;
}
function pair_bench_desp() {
  var d = captureDesp(sitting_desp);
  var m = captureDesp(molly_desp);
  if (!d && !m) return;
  if (!d) {
    printCapturedDesp(m);
    return;
  }
  if (!m) {
    printCapturedDesp(d);
    return;
  }
  var key = statusGroup(d);
  if (key === statusGroup(m) && emitDuoDesp(key)) return;
  printCapturedDesp(d);
  printCapturedDesp(m);
}
function pair_walk_desp() {
  var d = captureDesp(standing_desp);
  var m = captureDesp(mollyst_desp);
  if (!d && !m) return;
  if (!d) {
    printCapturedDesp(m);
    return;
  }
  if (!m) {
    printCapturedDesp(d);
    return;
  }
  var key = statusGroup(d);
  if (key === statusGroup(m) && emitDuoDesp(key)) return;
  printCapturedDesp(d);
  printCapturedDesp(m);
}
function molly_desp() {
  if (mollyblad < 425) s(TEXT.x04714);
  else if (mollyblad < 460) s(TEXT.x04715);
  else if (mollyblad < 500) s(TEXT.x04716);
  else if (mollyblad < 525) s(TEXT.x04717);
  else if (mollyblad < 550) s(TEXT.x04718);
  else if (mollyblad < 600) s(TEXT.x04719);
  else if (mollyblad < 650) s(TEXT.x04720);
  else if (mollyblad < 675) s(TEXT.x04721);
  else if (mollyblad < 700) s(TEXT.x04722);
  else if (mollyblad < 725) s(TEXT.x04723);
  else if (mollyblad < 750) s(TEXT.x05478);
  else if (mollyblad < 800) s(TEXT.x04726);
  else if (mollyblad < 850) s(TEXT.x04727);
  else if (mollyblad < 900) s(TEXT.x04728);
  else s(TEXT.x04729);
}
function albumdesp() {
  if (blad < 550) return;
  var band =
    blad < 650
      ? 1
      : blad < 667
        ? 2
        : blad < 675
          ? 3
          : blad < 687
            ? 4
            : blad < 700
              ? 5
              : blad < 725
                ? 6
                : blad < 750
                  ? 7
                  : blad < 775
                    ? 8
                    : blad < 800
                      ? 9
                      : blad < 825
                        ? 10
                        : blad < 850
                          ? 11
                          : blad < 875
                            ? 12
                            : 13;
  if (band === albumdespBand) return;
  albumdespBand = band;
  if (blad < 650) s(TEXT.x04731);
  else if (blad < 667) s(TEXT.x04732);
  else if (blad < 675) s(TEXT.x04733);
  else if (blad < 687) s(TEXT.x04734);
  else if (blad < 700) s(TEXT.x04735);
  else if (blad < 725) {
    s(TEXT.x04736);
    if (points < 20) {
      s(TEXT.x04737);
    } else {
      s(TEXT.x04738);
    }
  } else if (blad < 750) s(TEXT.x04739);
  else if (blad < 775) s(TEXT.x04740);
  else if (blad < 800) {
    s(TEXT.x04741);
    if (points < 20) {
      s(TEXT.x04742);
    } else {
      s(TEXT.x04743);
    }
  } else if (blad < 825) s(TEXT.x04744);
  else if (blad < 850) s(TEXT.x04745);
  else if (blad < 875) s(TEXT.x04746);
  else s(TEXT.x04747);
}
function mollyst_desp() {
  if (mollyblad < 400) s(TEXT.x04748);
  else if (mollyblad < 425) s(TEXT.x04749);
  else if (mollyblad < 475) s(TEXT.x04750);
  else if (mollyblad < 525) s(TEXT.x04751);
  else if (mollyblad < 575) s(TEXT.x04752);
  else if (mollyblad < 625) s(TEXT.x04753);
  else if (mollyblad < 675) s(TEXT.x04754);
  else if (mollyblad < 725) s(TEXT.x04755);
  else if (mollyblad < 780) s(TEXT.x04756);
  else if (mollyblad < 850) s(TEXT.x04757);
  else if (mollyblad < 900) s(TEXT.x04758);
  else s(TEXT.x04759);
}
function admission() {
  if (blad > 725 && blad <= 775) {
    s(TEXT.x05550);
    s(TEXT.x05479);
  } else if (blad > 775 && blad <= 825) {
    s(TEXT.x05480);
    s(TEXT.x05481);
  } else if (blad > 825) {
    s(TEXT.x05482);
    s(TEXT.x05483);
    s(TEXT.x04763);
    s(TEXT.x04764);
  } else {
    s(TEXT.x04765);
  }
  c("walkhomeX", TEXT.x04766);
}
function nightair() {
  if (tuesday) {
    if (burgundy) {
      s(TEXT.x04767);
      proc += 15;
      blad += 30;
    } else if (riesling) {
      s(TEXT.x04768);
      proc += 12;
      blad += 25;
    } else if (pinot) {
      s(TEXT.x04769);
      proc += 9;
      blad += 20;
    } else if (rioja) {
      s(TEXT.x04770);
      proc += 6;
      blad += 15;
    } else if (merlot) {
      s(TEXT.x04771);
      proc += 3;
      blad += 10;
    } else {
      s(TEXT.x04772);
      proc += 0;
      blad += 5;
    }
  } else if (thursday) {
    if (merlot) {
      s(TEXT.x04773);
      proc += 15;
      blad += 30;
    } else if (chardonnay) {
      s(TEXT.x04774);
      proc += 12;
      blad += 25;
    } else if (riesling) {
      s(TEXT.x04775);
      proc += 9;
      blad += 20;
    } else if (pinot) {
      s(TEXT.x04776);
      proc += 6;
      blad += 15;
    } else if (burgundy) {
      s(TEXT.x04777);
      proc += 3;
      blad += 10;
    } else {
      s(TEXT.x04778);
      proc += 0;
      blad += 5;
    }
  } else if (saturday) {
    if (pinot) {
      s(TEXT.x04779);
      proc += 15;
      blad += 30;
    } else if (merlot) {
      s(TEXT.x04780);
      proc += 12;
      blad += 25;
    } else if (chardonnay) {
      s(TEXT.x04781);
      proc += 9;
      blad += 20;
    } else if (riesling) {
      s(TEXT.x04782);
      proc += 6;
      blad += 15;
    } else if (rioja) {
      s(TEXT.x04783);
      proc += 3;
      blad += 10;
    } else {
      s(TEXT.x04784);
      proc += 0;
      blad += 5;
    }
  }
}
function afterpee() {
  if (tuesday) {
    if (merlot) blad = 0;
    else if (chardonnay) blad = 45;
    else if (riesling) blad = 90;
    else if (pinot) blad = 135;
    else if (burgundy) blad = 180;
    else blad = 25;
  } else if (thursday) {
    if (merlot) blad = 90;
    else if (chardonnay) blad = 135;
    else if (riesling) blad = 180;
    else if (pinot) blad = 225;
    else if (burgundy) blad = 0;
    else blad = 45;
  } else if (saturday) {
    if (merlot) blad = 180;
    else if (chardonnay) blad = 225;
    else if (riesling) blad = 0;
    else if (pinot) blad = 45;
    else if (burgundy) blad = 90;
    else blad = 135;
  }
}
function storytime() {
  if (tiramisu) {
    s(TEXT.x04785);
  } else if (pannacotta) {
    s(TEXT.x04787);
    s(TEXT.x04788);
    s(TEXT.x04789);
  } else if (icecream) {
    s(TEXT.x04790);
    s(TEXT.x04791);
  } else {
    s(TEXT.x05484);
    s(TEXT.x04793);
  }
}
function storytime1() {
  if (tiramisu) {
    s(TEXT.x05485);
    s(TEXT.x05486);
    s(TEXT.x04796);
  } else if (pannacotta) {
    s(TEXT.x05487);
    s(TEXT.x04798);
    s(TEXT.x04799);
  } else if (icecream) {
    s(TEXT.x04800);
    s(TEXT.x05488);
    s(TEXT.x04802);
  } else {
    s(TEXT.x04803);
    s(TEXT.x04804);
    s(TEXT.x05489);
    s(TEXT.x05008);
    s(TEXT.x05009);
  }
}
function emergency() {
  s(TEXT.x05490);
  s(TEXT.x04807);
  afterpee();
  s(TEXT.x05491);
  c("walkhomeX", TEXT.x04809);
}
function disaster() {
  s(TEXT.x04810);
  s(TEXT.x04811);
  c("disaster0", TEXT.x04812);
}
function disaster0() {
  s(TEXT.x04813);
  if (saturday) {
    s(TEXT.x04814);
  } else {
    s(TEXT.x04815);
  }
  s(TEXT.x05492);
  s(TEXT.x04817);
  s(TEXT.x04818);
  c("disaster1", TEXT.x04819);
}
function disaster1() {
  s(TEXT.x04820);
  s(TEXT.x04821);
  s(TEXT.x04822);
  afterpee();
  c("disaster2", TEXT.x04823);
}
function disaster2() {
  s(TEXT.x04824);
  if (thursday) {
    s(TEXT.x04825);
    s(TEXT.x04826);
  } else if (tuesday) {
    s(TEXT.x04827);
    s(TEXT.x04828);
  } else {
    s(TEXT.x04829);
    s(TEXT.x04830);
  }
  s(TEXT.x04831);
  c("disaster3", TEXT.x04832);
}
function disaster3() {
  s(TEXT.x04833);
  if (saturday) {
    s(TEXT.x04834);
  } else {
    s(TEXT.x04835);
  }
  s(TEXT.x04836);
  s(TEXT.x04837);
  s(TEXT.x04838);
  c("disaster4a", TEXT.x04839);
  c("disaster4b", TEXT.x04840);
  c("disaster4c", TEXT.x04841);
}
function disaster4a() {
  s(TEXT.x04842);
  s(TEXT.x04843);
  c("gameover", TEXT.x04844);
}
function disaster4c() {
  s(TEXT.x04845);
  if (thursday) {
    s(TEXT.x04846);
    s(TEXT.x04847);
    s(TEXT.x05493);
    s(TEXT.x04849);
  } else {
    s(TEXT.x04850);
    s(TEXT.x05494);
    s(TEXT.x05495);
    s(TEXT.x04853);
  }
  s(TEXT.x04854);
  c("disaster5c", TEXT.x04855);
}
function disaster5c() {
  s(TEXT.x04856);
  s(TEXT.x04857);
  s(TEXT.x04858);
  if (thursday) {
    s(TEXT.x04859);
  } else {
    s(TEXT.x04860);
  }
  s(TEXT.x04861);
  s(TEXT.x04862);
  s(TEXT.x04864);
  c("gameover", TEXT.x04865);
}
function disaster4b() {
  s(TEXT.x04866);
  if (thursday) {
    s(TEXT.x04867);
    s(TEXT.x04868);
    s(TEXT.x05496);
    s(TEXT.x04870);
  } else {
    s(TEXT.x04871);
    s(TEXT.x05497);
    s(TEXT.x05498);
    s(TEXT.x04874);
  }
  s(TEXT.x04875);
  s(TEXT.x04876);
  c("disaster5b", TEXT.x04877);
}
function disaster5b() {
  s(TEXT.x04878);
  s(TEXT.x04879);
  s(TEXT.x04880);
  s(TEXT.x04881);
  if (tuesday) {
    s(TEXT.x04882);
  } else if (thursday) {
    s(TEXT.x04883);
  } else {
    s(TEXT.x04884);
  }
  s(TEXT.x04885);
  c("disaster6b", TEXT.x04886);
}
function disaster6b() {
  s(TEXT.x04887);
  s(TEXT.x04888);
  s(TEXT.x04889);
  s(TEXT.x05499);
  s(TEXT.x04891);
  c("disaster7b", TEXT.x04892);
}
function disaster7b() {
  s(TEXT.x04893);
  s(TEXT.x04894);
  c("disaster8a", TEXT.x04895);
  c("disaster8b", TEXT.x04896);
  c("disaster8c", TEXT.x04897);
  c("disaster8d", TEXT.x04898);
}
function disaster8a() {
  s(TEXT.x04899);
  s(TEXT.x04900);
  s(TEXT.x04901);
  s(TEXT.x05500);
  s(TEXT.x04903);
  c("disaster9", TEXT.x04904);
}
function disaster9() {
  s(TEXT.x04905);
  s(TEXT.x04906);
  s(TEXT.x04907);
  if (thursday) {
    s(TEXT.x05501);
  } else {
    s(TEXT.x05502);
  }
  s(TEXT.x04910);
  c("disaster9a", TEXT.x04911);
}
function disaster9a() {
  s(TEXT.x04912);
  s(TEXT.x04913);
  c("triumph", TEXT.x04914);
}
function triumph() {
  s(TEXT.x04915);
  s(TEXT.x04916);
  if (thursday) {
    s(TEXT.x04917);
    blad = 0;
  } else {
    s(TEXT.x04918);
    blad = 0;
  }
  s(TEXT.x04919);
  s(TEXT.x04920);
}
function disaster8b() {
  s(TEXT.x04922);
  s(TEXT.x05503);
  s(TEXT.x04924);
  s(TEXT.x04925);
  c("gameover", TEXT.x04926);
}
function disaster8c() {
  s(TEXT.x04927);
  s(TEXT.x04928);
  s(TEXT.x04929);
  s(TEXT.x04930);
  s(TEXT.x04931);
  s(TEXT.x04932);
  c("disaster8ca", TEXT.x04933);
}
function disaster8ca() {
  s(TEXT.x04934);
  if (thursday) {
    s(TEXT.x04935);
  } else if (tuesday) {
    s(TEXT.x04936);
  } else {
    s(TEXT.x04937);
  }
  s(TEXT.x04938);
  c("consolation", TEXT.x04939);
}
function consolation() {
  s(TEXT.x04940);
}
function disaster8d() {
  s(TEXT.x04941);
  s(TEXT.x04942);
  c("gameover", TEXT.x04943);
}
