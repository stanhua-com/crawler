// models/proxy.ts

export interface ProxyModel {
  /**
   * IP地址	
   */
  ip: string;
  /**
   * 端口	
   */
  port: number;
  /**
   * 匿名度		
   */
  anonymity?: string;
  /**
   * 类型		
   */
  type?: string;
  /**
   * 地理位置
   */
  loaction?: string;
  /**
   * 所属国
   */
  country?: string;
  /**
   * 运营商
   */
  operator?: string;
  /**
   * 响应速度	
   */
  speed?: string;
  /**
   * 存活时间		
   */
  surviveTime?: string;
  /**
   * 最后验证时间		
   */
  verificationTime?: string;
}
