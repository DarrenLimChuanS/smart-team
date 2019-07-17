INSERT IGNORE INTO roles(name) VALUES("ROLE_USER");
INSERT IGNORE INTO roles(name) VALUES("ROLE_STUDENT");
INSERT IGNORE INTO roles(name) VALUES("ROLE_ADMIN");
INSERT IGNORE INTO `choices` VALUES (1,1,"16-18",1),(2,2,"19-21",1),(3,3,"22-24",1),(4,4,"25-27",1),(5,5,"Not at all",2),(6,4,"Rarely",2),(7,2,"Sometimes",2),(8,1,"Often",2),(9,1,"Not at all",3),(10,2,"Rarely",3),(11,4,"Sometimes",3),(12,5,"Often",3),(13,1,"Strongly Agree",4),(14,2,"Agree",4),(15,4,"Disagree",4),(16,5,"Strongly Disagree",4),(17,5,"Strongly Agree",5),(18,4,"Agree",5),(19,2,"Disagree",5),(20,1,"Strongly Disagree",5),(21,5,"Strongly Agree",6),(22,4,"Agree",6),(23,2,"Disagree",6),(24,1,"Strongly Disagree",6);
INSERT IGNORE INTO `courses` VALUES (1,"2019-06-30 18:53:55","2019-06-30 18:53:55",9,9,"ICT1001","This module is intended to be at an introductory level to provide an overview of the different modules taught in the ICT programme. ","Introduction to ICT"),(2,"2019-06-30 18:54:17","2019-06-30 18:54:17",9,9,"ICT1002","This module is intended for students with no prior computing knowledge or experience beyond a basic familiarity with the operation of a personal computer and can be taken by any student interested in acquiring basic programming skills.","Programming Fundamentals"),(3,"2019-06-30 18:54:30","2019-06-30 18:54:30",9,9,"ICT1003","This is a foundation module whose main focus is on the characteristics and development of relatively high level ‘building’ blocks of a computer system. ","Computer Organisation and Architecture"),(4,"2019-06-30 18:54:42","2019-06-30 18:54:42",9,9,"ICT1004","This module covers the essential web technologies to equip students with the useful skills to build websites for web-based IT applications.","Web Systems and Technologies"),(5,"2019-06-30 18:54:55","2019-06-30 18:54:55",9,9,"ICT1005","This module will equip students with the core mathematical knowledge in two broad focus areas: discrete mathematics, and probability and statistics.","Mathematics and Statistics for ICT");
INSERT IGNORE INTO `criteria` VALUES (1,"2019-06-30 18:59:03","2019-06-30 18:59:03",9,9,"This criteria categorises students according to their age.","\0","Age",1,2,3,4),(2,"2019-06-30 19:23:59","2019-06-30 19:23:59",9,9,"This criteria categorises the leadership skills that the student has.","","Leadership",2,5,7,10),(3,"2019-06-30 19:30:24","2019-06-30 19:30:24",9,9,"This criteria categorises the students' likeliness of being a team player.","","Team Player",3,7,11,15);
INSERT IGNORE INTO `questionnaire` VALUES (1,"2019-06-30 19:33:55","2019-06-30 19:33:55",9,9,"Please go through all the questions honestly.","ICT1001 IRAT Formation");
INSERT IGNORE INTO `questionnaire_criteria` VALUES (1,1),(1,2),(1,3);
INSERT IGNORE INTO `roles` VALUES (3,"ROLE_ADMIN"),(2,"ROLE_STUDENT"),(1,"ROLE_USER");
INSERT IGNORE INTO `section` VALUES (1,"2019-06-30 18:55:51","2019-06-30 19:40:17",9,9,"ICT1001 - T1",5,"Not Teamed",2019,1),(2,"2019-06-30 18:56:42","2019-06-30 18:56:42",9,9,"ICT1001 - T2",4,"Not Teamed",2019,1),(3,"2019-06-30 18:57:10","2019-06-30 18:57:10",9,9,"ICT1002 - T1",5,"Not Teamed",2019,2),(4,"2019-06-30 18:57:26","2019-06-30 18:57:26",9,9,"ICT1002 - T2",4,"Not Teamed",2019,2);
INSERT IGNORE INTO `section_users` VALUES (1,12),(1,14),(1,16),(1,18),(1,19),(2,11),(2,13),(2,15),(2,17),(3,11),(3,12),(3,13),(3,14),(3,15),(4,16),(4,17),(4,18),(4,19);
INSERT IGNORE INTO `polls` VALUES (1,"2019-06-30 18:59:03","2019-06-30 18:59:03",9,9,"What is your age?",1),(2,"2019-06-30 19:23:59","2019-06-30 19:23:59",9,9,"How often do you develop plans?",2),(3,"2019-06-30 19:23:59","2019-06-30 19:23:59",9,9,"How often do you doubt yourself and your ability to succeed?",2),(4,"2019-06-30 19:30:24","2019-06-30 19:30:24",9,9,"For most projects, I prefer to rely on my own skills and abilities rather than work with others.",3),(5,"2019-06-30 19:30:24","2019-06-30 19:30:24",9,9,"People generally enjoy working with me on a team.",3),(6,"2019-06-30 19:30:24","2019-06-30 19:30:24",9,9,"I seek out ways to learn to get along better with people and to do a better job of collaborating, to be a better team member.",3);
INSERT IGNORE INTO `user_roles` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2);
INSERT IGNORE INTO `users` VALUES (1,"2019-06-28 16:47:48","2019-06-28 16:47:48",NULL,NULL,"marcelinadaye@hotmail.com","Professor Marcelina Daye","$2a$10$xECiXbz3QHzwigC4ryhm3uimIuYwse4E4zu9x/h1NYEa2RiBtv3S2","marcelinadaye"),(2,"2019-06-30 18:47:16","2019-06-30 18:47:16",NULL,NULL,"darrenlim@hotmail.com","Professor Darren Lim","$2a$10$JrbtuTV2op8JccebsyriZe0BvKtAN0JoT7EwdDifR92v4LkxXDYvq","darrenlim"),(3,"2019-06-30 18:47:28","2019-06-30 18:47:28",NULL,NULL,"darrenlow@hotmail.com","Professor Darren Low","$2a$10$yXmRXplhd0mszPyEucDe/eReVp4OY0r6zrOJuZ.7v6vc9t7JnlXju","darrenlow"),(4,"2019-06-30 18:47:39","2019-06-30 18:47:39",NULL,NULL,"mingfeng@hotmail.com","Professor Ming Feng","$2a$10$pgsPlstJNOc1HmQ52AO4g.i7b45FKxIkTMeN0jFTUAXVCnK.CMWAa","mingfeng"),(5,"2019-06-30 18:47:54","2019-06-30 18:47:54",NULL,NULL,"qinxiang@hotmail.com","Professor Qin Xiang","$2a$10$OU3vLQA21h9bGsXekN85eOvliVS339FDKgyAzXappudYh2/zbBHDa","qinxiang"),(6,"2019-06-30 18:48:33","2019-06-30 18:48:33",NULL,NULL,"seritahey@hotmail.com","Professor Serita Hey","$2a$10$/wCMyY4r3IG23f861MszvuPOrggfJVvfXaot5dWYhWTrYyBA8dl5G","seritahey"),(7,"2019-06-30 18:48:51","2019-06-30 18:48:51",NULL,NULL,"cherryllossett@hotmail.com","Professor Cherryl Lossett","$2a$10$jhn6PhYfwxEb8HBS0h0qmeMVsmg4QtySbd/cqCRTG4tM46X9zLhqu","cherryllossett"),(8,"2019-06-30 18:49:07","2019-06-30 18:49:07",NULL,NULL,"teddysebesta@hotmail.com","Professor Teddy Sebesta","$2a$10$pffUxheP9j5YFhxwxagoqelelXrPg.lLqok7TmbNc3XlDYwxiw5ku","teddysebesta"),(9,"2019-06-30 18:49:34","2019-06-30 18:49:34",NULL,NULL,"admin@hotmail.com","Professor Admin","$2a$10$vDEPittGTyAaAqU4s05Deuz7lnSmaSdLVof1YNLyCtoRC8JS1zA.6","admin"),(10,"2019-06-30 18:50:00","2019-06-30 18:50:00",NULL,NULL,"carliebusey@hotmail.com","Professor Carlie Busey","$2a$10$09bt4NPaSTB8C1k./ZvmseK/1x7iy0LpUqlNmcoMv4sjg6QzIuNTu","carliebusey"),(11,"2019-06-30 18:50:25","2019-06-30 18:50:25",9,9,"essieblakney@hotmail.com","Essie Blakney","$2a$10$w3H5DCs.QSN49UsWKc8jWeBzqqF29/58YgfOkWsGf.RsiOhZyi0Uq","essieblakney"),(12,"2019-06-30 18:50:36","2019-06-30 18:50:36",9,9,"ginabulter@hotmail.com","Gina Bulter","$2a$10$ctVg6UEeMlyoJUpaHr1OC.NCK4jmZLTDc7/XONPJRwaceTDXHH5ju","ginabulter"),(13,"2019-06-30 18:50:48","2019-06-30 18:50:48",9,9,"soofearon@hotmail.com","Soo Fearon","$2a$10$o1vO.RGFdy4FfTBW853JUe8rEDfUC77JZo21AktFZq5uv/UOUxf0.","soofearon"),(14,"2019-06-30 18:51:03","2019-06-30 18:51:03",9,9,"jeanninecheck@hotmail.com","Jeannine Check","$2a$10$ZYUsFY523H7BzqVkIsTDSuphZy6PgCe4viBa9FErKneLxCwavHdlS","jeanninecheck"),(15,"2019-06-30 18:51:16","2019-06-30 18:51:16",9,9,"cindiejeske@hotmail.com","Cindie Jeske","$2a$10$zuw3iWYVa9z4XcgdBfWCTuf2NxCHqwzDzeam7gsEmjp4efMX9d6Eu","cindiejeske"),(16,"2019-06-30 18:51:35","2019-06-30 18:51:35",9,9,"nidatrueblood@hotmail.com","Nida Trueblood","$2a$10$AuBzctrto7VDu9ttfHv0T.2DN4DZoeM0gVzz8ujcU./tF8.7lPAgq","nidatrueblood"),(17,"2019-06-30 18:51:50","2019-06-30 18:51:50",9,9,"elvinwoodhouse@hotmail.com","Elvin Woodhouse","$2a$10$YHKitds9EiuWIpTwRP82suyxMlN6LDGipv2s1ZVrskZtLuzQOloWm","elvinwoodhouse"),(18,"2019-06-30 18:52:14","2019-06-30 18:52:14",9,9,"jonsnow@hotmail.com","Jon Snow","$2a$10$k4Fw6YTKBiyzjhtJCsJB9eCiNmTlllLdUWrApMTBKEjFEcw7AUE6m","jonsnow"),(19,"2019-06-30 18:52:39","2019-06-30 18:52:39",9,9,"amadomcloud@hotmail.com","Amado Mcloud","$2a$10$lxNManFEdSHmm6RXnehUQepjiqI9sV8BsLG9aWJxITwFMb1t5bNL.","amadomcloud");
INSERT IGNORE INTO `votes` VALUES (1,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,6,1,12),(2,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,4,1,12),(3,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,5,1,12),(4,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,1,1,1,12),(5,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,2,3,1,12),(6,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,2,2,1,12),(7,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,6,1,16),(8,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,4,1,16),(9,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,5,1,16),(10,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,1,1,1,16),(11,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,2,3,1,16),(12,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,2,2,1,16),(13,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,6,1,19),(14,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,4,1,19),(15,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,3,5,1,19),(16,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,1,1,1,19),(17,"2019-06-30 19:40:17","2019-06-30 19:40:17",NULL,NULL,2,3,1,19),(18,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,2,2,1,19),(19,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,3,6,1,14),(20,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,3,4,1,14),(21,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,3,5,1,14),(22,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,1,1,1,14),(23,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,2,3,1,14),(24,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,2,2,1,14),(25,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,3,6,1,18),(26,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,3,4,1,18),(27,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,3,5,1,18),(28,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,1,1,1,18),(29,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,2,3,1,18),(30,"2019-06-30 19:40:18","2019-06-30 19:40:18",NULL,NULL,2,2,1,18);