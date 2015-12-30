package com.teradata.mda.test.poi;

/**
 * Created by YS186019 on 2015/11/4.
 */

        import java.io.FileOutputStream;
        import java.util.ArrayList;
        import java.util.Arrays;
        import java.util.List;
        import org.apache.poi.hssf.usermodel.HSSFCell;
        import org.apache.poi.hssf.usermodel.HSSFRow;
        import org.apache.poi.hssf.usermodel.HSSFSheet;
        import org.apache.poi.hssf.usermodel.HSSFWorkbook;
        import org.apache.poi.ss.usermodel.Cell;
        import org.apache.poi.ss.usermodel.Row;
        import org.apache.poi.ss.usermodel.Sheet;
        import org.apache.poi.ss.util.CellReference;
        import org.apache.poi.xssf.streaming.SXSSFSheet;
        import org.apache.poi.xssf.streaming.SXSSFWorkbook;

public class GenerateExcel {

    /**
     * 生成Excel示例，2003和2007
     *
     * @author Nanlei
     *
     */

        private static String xls2003 = "C:\\student.xls";
        private static String xlsx2007 = "C:\\student.xlsx";
        private static List<Student> studentList = null;
        private static Student[] students = new Student[4];
        /**
         * 静态块初始化数据
         */
        static {
            studentList = new ArrayList<Student>();
            students[0] = new Student("张三", "男", 23, "一班", 94);
            students[1] = new Student("李四", "女", 20, "一班", 92);
            students[2] = new Student("王五", "男", 21, "一班", 87);
            students[3] = new Student("赵六", "女", 22, "一班", 83);
            studentList.addAll(Arrays.asList(students));
        }
        /**
         * 创建2003文件的方法
         *
         * @param filePath
         */
        public static void generateExcel2003(String filePath) {
            FileOutputStream fos=null;
            try {
                 fos = new FileOutputStream(filePath);
                // 先创建工作簿对象
                HSSFWorkbook workbook2003 = new HSSFWorkbook();
                // 创建工作表对象并命名
                HSSFSheet sheet = workbook2003.createSheet("学生信息统计表");
                // 遍历集合对象创建行和单元格
                for (int i = 0; i < studentList.size(); i++) {
                    // 取出Student对象
                    Student student = studentList.get(i);
                    // 创建行
                    HSSFRow row = sheet.createRow(i);
                    // 开始创建单元格并赋值
                    HSSFCell nameCell = row.createCell(0);
                    nameCell.setCellValue(student.getName());
                    HSSFCell genderCell = row.createCell(1);
                    genderCell.setCellValue(student.getGender());
                    HSSFCell ageCell = row.createCell(2);
                    ageCell.setCellValue(student.getAge());
                    HSSFCell sclassCell = row.createCell(3);
                    sclassCell.setCellValue(student.getSclass());
                    HSSFCell scoreCell = row.createCell(4);
                    scoreCell.setCellValue(student.getScore());


                }
                // 生成文件
                workbook2003.write(fos);

            }catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (fos != null) {
                    try {
                        fos.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }


        public static void generateExcel2007(){
            try{
                long curr_time=System.currentTimeMillis();

                int rowaccess=100;//内存中缓存记录行数
           /*keep 100 rowsin memory,exceeding rows will be flushed to disk*/
                SXSSFWorkbook wb = new SXSSFWorkbook(rowaccess);

                int sheet_num=3;//生成3个SHEET
                for(int i=0;i<sheet_num;i++){
                    Sheet sh = wb.createSheet();
                    //每个SHEET有60000ROW
                    for(int rownum = 0; rownum < 60000; rownum++) {
                        Row row = sh.createRow(rownum);
                        //每行有10个CELL
                        for(int cellnum = 0; cellnum < 10; cellnum++) {
                            Cell cell = row.createCell(cellnum);
                            String address = new CellReference(cell).formatAsString();
                            cell.setCellValue(address);
                        }

                        //每当行数达到设置的值就刷新数据到硬盘,以清理内存
                        if(rownum%rowaccess==0){
                            ((SXSSFSheet)sh).flushRows();
                        }
                    }
                }

           /*写数据到文件中*/
                FileOutputStream os = new FileOutputStream("d:/biggrid.xlsx");
                wb.write(os);
                os.close();

           /*计算耗时*/
                System.out.println("耗时:"+(System.currentTimeMillis()-curr_time)/1000);

            } catch(Exception e) {
                e.printStackTrace();
            }
        }


        /**
         * 主函数
         *
         * @param args
         */
        public static void main(String[] args) {
            long start = System.currentTimeMillis();
            //generateExcel2003(xls2003);
            generateExcel2007();
            long end = System.currentTimeMillis();
            System.out.println((end - start) + " ms done!");
        }




}
