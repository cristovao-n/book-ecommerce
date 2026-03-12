"use client"

import { useEffect } from "react";

export default function Success() {
    useEffect(() => {
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (!sessionId) return;
      
        fetch(`/api/checkout/verify?session_id=${sessionId}`)
          .then(r => r.json())
          .then(data => {
            if (data.status === 'paid') {
              console.log('Pago:', data.amountTotal / 100, 'reais');
              console.log('Cliente:', data.customerEmail);
            }
          });
      }, []);
    return (
        <div className="flex justify-center">
            <h1>DONE</h1>
        </div>
    )
}