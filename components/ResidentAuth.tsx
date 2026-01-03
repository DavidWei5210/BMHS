
import React, { useState, useRef, useEffect } from 'react';
import { Camera, CreditCard, ScanFace, CheckCircle, Upload, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const ResidentAuth: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (step === 2) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step]);

  const handleNext = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(prev => prev + 1);
    }, 1500);
  };

  const steps = [
    { id: 1, title: '身份信息采集', icon: User },
    { id: 2, title: '人脸活体检测', icon: ScanFace },
    { id: 3, title: '银行卡绑定', icon: CreditCard },
    { id: 4, title: '认证完成', icon: CheckCircle },
  ];

  return (
    <div {...({ className: "max-w-4xl mx-auto space-y-8 animate-fade-in" } as any)}>
      <div {...({ className: "text-center" } as any)}>
        <h2 {...({ className: "text-2xl font-bold text-gray-800" } as any)}>边民实名认证通道</h2>
        <p {...({ className: "text-gray-500 mt-2" } as any)}>请按照流程完成身份核验，开通互市贸易权限</p>
      </div>

      {/* Progress Bar */}
      <div {...({ className: "relative flex justify-between items-center px-10" } as any)}>
        <div {...({ className: "absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full" } as any)}></div>
        <div 
          {...({ className: "absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500", style: { width: `${((step - 1) / 3) * 100}%` } } as any)}
        ></div>
        {steps.map((s) => (
          <div key={s.id} {...({ className: "flex flex-col items-center gap-2 bg-gray-50 p-2 rounded-xl" } as any)}>
            <div {...({ className: `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              step >= s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-2 border-gray-200 text-gray-400'
            }` } as any)}>
              <s.icon size={20} />
            </div>
            <span {...({ className: `text-xs font-medium ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}` } as any)}>{s.title}</span>
          </div>
        ))}
      </div>

      <div {...({ className: "bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[400px] flex flex-col items-center justify-center" } as any)}>
        
        {/* Step 1: ID Upload */}
        {step === 1 && (
          <div {...({ className: "w-full max-w-lg space-y-6" } as any)}>
            <div {...({ className: "grid grid-cols-2 gap-6" } as any)}>
              <div {...({ className: "border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all h-48 group" } as any)}>
                <div {...({ className: "w-16 h-10 bg-gray-200 rounded flex items-center justify-center group-hover:bg-blue-100" } as any)}>
                   <User {...({ className: "text-gray-400 group-hover:text-blue-500" } as any)} />
                </div>
                <div {...({ className: "text-center" } as any)}>
                   <p {...({ className: "text-sm font-semibold text-gray-700" } as any)}>上传身份证人像面</p>
                   <p {...({ className: "text-xs text-gray-400 mt-1" } as any)}>点击上传或拖拽文件</p>
                </div>
              </div>
              <div {...({ className: "border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all h-48 group" } as any)}>
                <div {...({ className: "w-16 h-10 bg-gray-200 rounded flex items-center justify-center group-hover:bg-blue-100" } as any)}>
                   <ShieldCheck {...({ className: "text-gray-400 group-hover:text-blue-500" } as any)} />
                </div>
                <div {...({ className: "text-center" } as any)}>
                   <p {...({ className: "text-sm font-semibold text-gray-700" } as any)}>上传身份证国徽面</p>
                   <p {...({ className: "text-xs text-gray-400 mt-1" } as any)}>点击上传或拖拽文件</p>
                </div>
              </div>
            </div>
            <div {...({ className: "bg-yellow-50 p-3 rounded-lg flex gap-2 text-yellow-700 text-sm" } as any)}>
               <ShieldCheck size={16} {...({ className: "shrink-0 mt-0.5" } as any)} />
               <p>系统将自动识别身份证信息，请确保图片清晰、四角完整。</p>
            </div>
          </div>
        )}

        {/* Step 2: Face Detection */}
        {step === 2 && (
          <div {...({ className: "w-full max-w-md space-y-6 text-center" } as any)}>
            <div {...({ className: "relative w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-blue-100 shadow-inner bg-black" } as any)}>
              {/* Fix: Using correct property names based on error suggestions */}
              <video 
                ref={videoRef}
                {...({ autoplay: true, playsinline: true, muted: true, className: "w-full h-full object-cover transform scale-x-[-1]" } as any)}
              />
              <div {...({ className: "absolute inset-0 border-4 border-blue-500/50 rounded-full animate-pulse" } as any)}></div>
            </div>
            <div {...({ className: "" } as any)}>
              <h3 {...({ className: "text-lg font-bold text-gray-800" } as any)}>请正对摄像头</h3>
              <p {...({ className: "text-gray-500 mt-1" } as any)}>正在进行活体检测，请眨眨眼...</p>
            </div>
          </div>
        )}

        {/* Step 3: Bank Card */}
        {step === 3 && (
          <div {...({ className: "w-full max-w-md space-y-6" } as any)}>
            <div {...({ className: "space-y-4" } as any)}>
               <div {...({ className: "" } as any)}>
                 <label {...({ className: "block text-sm font-medium text-gray-700 mb-1" } as any)}>开户银行</label>
                 <select {...({ className: "w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none" } as any)}>
                   <option>中国银行 (边贸结算推荐)</option>
                   <option>云南农村信用社</option>
                   <option>中国建设银行</option>
                 </select>
               </div>
               <div {...({ className: "" } as any)}>
                 <label {...({ className: "block text-sm font-medium text-gray-700 mb-1" } as any)}>银行卡号</label>
                 <div {...({ className: "relative" } as any)}>
                   <CreditCard {...({ className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" } as any)} size={18} />
                   <input type="text" placeholder="请输入本人银行卡号" {...({ className: "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" } as any)} />
                 </div>
               </div>
               <div {...({ className: "" } as any)}>
                 <label {...({ className: "block text-sm font-medium text-gray-700 mb-1" } as any)}>预留手机号</label>
                 <input type="text" placeholder="请输入银行预留手机号" {...({ className: "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" } as any)} />
               </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div {...({ className: "text-center space-y-4 animate-scale-in" } as any)}>
            <div {...({ className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600" } as any)}>
              <CheckCircle size={40} />
            </div>
            <div {...({ className: "" } as any)}>
              <h3 {...({ className: "text-2xl font-bold text-gray-800" } as any)}>认证提交成功</h3>
              <p {...({ className: "text-gray-500 mt-2 max-w-md mx-auto" } as any)}>您的实名认证资料已提交，预计在2小时内完成海关系统备案。审核通过后即可开始互市贸易申报。</p>
            </div>
            <button {...({ className: "px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 mt-4" } as any)}>
              返回个人中心
            </button>
          </div>
        )}

        {/* Action Button */}
        {step < 4 && (
          <button 
            onClick={handleNext}
            disabled={isProcessing}
            {...({ className: `mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}` } as any)}
          >
            {isProcessing ? '处理中...' : step === 3 ? '提交审核' : '下一步'}
            {!isProcessing && <ArrowRight size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};
